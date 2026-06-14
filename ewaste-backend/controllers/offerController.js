const pool = require("../config/db");
const { success, error } = require("../utils/apiResponse");

// ── Make Offer (company) ───────────────────────────────────────────────────
exports.makeOffer = async (req, res) => {
  try {
    const company_id = req.user.id;
    const { listing_id, amount, message, pickup_date, pickup_slot } = req.body;

    const [listing] = await pool.query(
      "SELECT * FROM listings WHERE id = ? AND status IN ('active','bidding')",
      [listing_id],
    );
    if (!listing.length) return error(res, "Listing not available", 404);

    const [existing] = await pool.query(
      "SELECT id FROM offers WHERE listing_id = ? AND company_id = ?",
      [listing_id, company_id],
    );
    if (existing.length)
      return error(res, "You already made an offer on this listing", 409);

    const [result] = await pool.query(
      `INSERT INTO offers (listing_id, company_id, amount, message, pickup_date, pickup_slot)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [listing_id, company_id, amount, message, pickup_date, pickup_slot],
    );

    await pool.query("UPDATE listings SET status = 'bidding' WHERE id = ?", [
      listing_id,
    ]);
    return success(res, { id: result.insertId }, "Offer submitted", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Accept Offer (customer) ────────────────────────────────────────────────
exports.acceptOffer = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { offer_id } = req.params;

    const [offerRows] = await pool.query(
      `
      SELECT o.*, l.user_id FROM offers o JOIN listings l ON o.listing_id = l.id WHERE o.id = ?
    `,
      [offer_id],
    );

    if (!offerRows.length) return error(res, "Offer not found", 404);
    const offer = offerRows[0];
    if (offer.user_id !== user_id) return error(res, "Unauthorized", 403);

    // Reject all other offers on this listing
    await pool.query(
      "UPDATE offers SET status = 'rejected' WHERE listing_id = ? AND id != ?",
      [offer.listing_id, offer_id],
    );
    await pool.query(
      "UPDATE offers SET status = 'accepted', is_winning = 1 WHERE id = ?",
      [offer_id],
    );
    await pool.query("UPDATE listings SET status = 'accepted' WHERE id = ?", [
      offer.listing_id,
    ]);

    return success(res, {}, "Offer accepted");
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Reject Offer (customer) ────────────────────────────────────────────────
exports.rejectOffer = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { offer_id } = req.params;

    const [offerRows] = await pool.query(
      `
      SELECT o.*, l.user_id FROM offers o JOIN listings l ON o.listing_id = l.id WHERE o.id = ?
    `,
      [offer_id],
    );

    if (!offerRows.length) return error(res, "Offer not found", 404);
    if (offerRows[0].user_id !== user_id)
      return error(res, "Unauthorized", 403);

    await pool.query("UPDATE offers SET status = 'rejected' WHERE id = ?", [
      offer_id,
    ]);
    return success(res, {}, "Offer rejected");
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Company's Own Offers ───────────────────────────────────────────────────
exports.myOffers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT o.*, l.title AS listing_title, l.city, c.name AS category_name,
             (SELECT image_url FROM listing_images WHERE listing_id = l.id AND is_primary = 1 LIMIT 1) AS primary_image
      FROM offers o
      JOIN listings l ON o.listing_id = l.id
      JOIN categories c ON l.category_id = c.id
      WHERE o.company_id = ? ORDER BY o.created_at DESC
    `,
      [req.user.id],
    );

    return success(res, rows);
  } catch (err) {
    return error(res, err.message);
  }
};
