const pool = require("../config/db");
const { success, error } = require("../utils/apiResponse");

// ── Create Listing ─────────────────────────────────────────────────────────
exports.createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      category_id,
      brand,
      model,
      condition_type,
      quantity,
      estimated_weight,
      estimated_price,
      city,
      pincode,
      bidding_ends_at,
    } = req.body;
    const user_id = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO listings (user_id, category_id, title, description, brand, model, condition_type, quantity, estimated_weight, estimated_price, city, pincode, bidding_ends_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        category_id,
        title,
        description,
        brand,
        model,
        condition_type,
        quantity,
        estimated_weight,
        estimated_price,
        city,
        pincode,
        bidding_ends_at || null,
      ],
    );

    const listingId = result.insertId;

    // Save uploaded images
    if (req.files && req.files.length > 0) {
      const imageValues = req.files.map((file, i) => [
        listingId,
        `/uploads/${file.filename}`,
        i === 0,
      ]);
      await pool.query(
        "INSERT INTO listing_images (listing_id, image_url, is_primary) VALUES ?",
        [imageValues],
      );
    }

    return success(res, { id: listingId }, "Listing created", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Get All Active Listings (for companies to browse) ──────────────────────
exports.getAllListings = async (req, res) => {
  try {
    const {
      city,
      category_id,
      condition_type,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT l.*, c.name AS category_name, u.name AS user_name, u.city AS user_city,
             (SELECT image_url FROM listing_images WHERE listing_id = l.id AND is_primary = 1 LIMIT 1) AS primary_image
      FROM listings l
      JOIN categories c ON l.category_id = c.id
      JOIN users u ON l.user_id = u.id
      WHERE l.status IN ('active','bidding')
    `;
    const params = [];

    if (city) {
      query += " AND l.city = ?";
      params.push(city);
    }
    if (category_id) {
      query += " AND l.category_id = ?";
      params.push(category_id);
    }
    if (condition_type) {
      query += " AND l.condition_type = ?";
      params.push(condition_type);
    }

    query += " ORDER BY l.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    return success(res, rows);
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Get Single Listing ─────────────────────────────────────────────────────
exports.getListing = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT l.*, c.name AS category_name, u.name AS user_name, u.phone AS user_phone, u.city AS user_city
      FROM listings l
      JOIN categories c ON l.category_id = c.id
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `,
      [id],
    );

    if (!rows.length) return error(res, "Listing not found", 404);

    const [images] = await pool.query(
      "SELECT image_url, is_primary FROM listing_images WHERE listing_id = ?",
      [id],
    );
    const [offers] = await pool.query(
      `
      SELECT o.id, o.amount, o.pickup_date, o.pickup_slot, o.status, co.name AS company_name, co.avg_rating
      FROM offers o JOIN companies co ON o.company_id = co.id
      WHERE o.listing_id = ? ORDER BY o.amount DESC
    `,
      [id],
    );

    await pool.query(
      "UPDATE listings SET views_count = views_count + 1 WHERE id = ?",
      [id],
    );

    return success(res, { ...rows[0], images, offers });
  } catch (err) {
    return error(res, err.message);
  }
};

// ── My Listings (customer) ─────────────────────────────────────────────────
exports.myListings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT l.*, c.name AS category_name,
             (SELECT image_url FROM listing_images WHERE listing_id = l.id AND is_primary = 1 LIMIT 1) AS primary_image,
             (SELECT COUNT(*) FROM offers WHERE listing_id = l.id) AS offer_count
      FROM listings l JOIN categories c ON l.category_id = c.id
      WHERE l.user_id = ? ORDER BY l.created_at DESC
    `,
      [req.user.id],
    );

    return success(res, rows);
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Cancel Listing ─────────────────────────────────────────────────────────
exports.cancelListing = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM listings WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
    );
    if (!rows.length) return error(res, "Listing not found", 404);
    if (["picked_up", "cancelled"].includes(rows[0].status))
      return error(res, "Cannot cancel this listing", 400);

    await pool.query("UPDATE listings SET status = 'cancelled' WHERE id = ?", [
      req.params.id,
    ]);
    return success(res, {}, "Listing cancelled");
  } catch (err) {
    return error(res, err.message);
  }
};
