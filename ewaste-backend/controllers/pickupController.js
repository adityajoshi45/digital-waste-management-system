const pool = require("../config/db");
const { success, error } = require("../utils/apiResponse");
const generateQR = require("../utils/generateQR");
const { calcCO2 } = require("../utils/calcImpact");

// ── Schedule Pickup (company, after offer accepted) ────────────────────────
exports.schedulePickup = async (req, res) => {
  try {
    const { offer_id, scheduled_date, scheduled_slot } = req.body;

    const [offerRows] = await pool.query(
      `
      SELECT o.*, l.user_id FROM offers o JOIN listings l ON o.listing_id = l.id
      WHERE o.id = ? AND o.company_id = ? AND o.status = 'accepted'
    `,
      [offer_id, req.user.id],
    );

    if (!offerRows.length) return error(res, "Accepted offer not found", 404);
    const offer = offerRows[0];

    const qr_code = await generateQR(offer_id);

    const [result] = await pool.query(
      `INSERT INTO pickups (listing_id, offer_id, user_id, company_id, scheduled_date, scheduled_slot, qr_code)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        offer.listing_id,
        offer_id,
        offer.user_id,
        req.user.id,
        scheduled_date,
        scheduled_slot,
        qr_code,
      ],
    );

    return success(
      res,
      { id: result.insertId, qr_code },
      "Pickup scheduled",
      201,
    );
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Complete Pickup (company) ──────────────────────────────────────────────
exports.completePickup = async (req, res) => {
  try {
    const { pickup_id } = req.params;
    const { actual_weight, final_amount } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM pickups WHERE id = ? AND company_id = ?",
      [pickup_id, req.user.id],
    );
    if (!rows.length) return error(res, "Pickup not found", 404);

    const pickup = rows[0];

    await pool.query(
      `UPDATE pickups SET status = 'completed', actual_weight = ?, final_amount = ?, completed_at = NOW() WHERE id = ?`,
      [actual_weight, final_amount, pickup_id],
    );

    // Credit customer wallet
    const [[user]] = await pool.query(
      "SELECT wallet_balance FROM users WHERE id = ?",
      [pickup.user_id],
    );
    const newBalance =
      parseFloat(user.wallet_balance) + parseFloat(final_amount);
    await pool.query("UPDATE users SET wallet_balance = ? WHERE id = ?", [
      newBalance,
      pickup.user_id,
    ]);
    await pool.query(
      `INSERT INTO wallet_transactions (user_id, pickup_id, type, amount, balance_after, description)
       VALUES (?, ?, 'credit', ?, ?, ?)`,
      [
        pickup.user_id,
        pickup_id,
        final_amount,
        newBalance,
        `Payment for pickup #${pickup_id}`,
      ],
    );

    // Update listing status
    await pool.query("UPDATE listings SET status = 'picked_up' WHERE id = ?", [
      pickup.listing_id,
    ]);

    // Update impact tracker
    const co2 = calcCO2(actual_weight);
    await pool.query(
      `
      INSERT INTO impact_records (user_id, total_weight, co2_saved, items_count)
      VALUES (?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        total_weight = total_weight + VALUES(total_weight),
        co2_saved    = co2_saved    + VALUES(co2_saved),
        items_count  = items_count  + 1
    `,
      [pickup.user_id, actual_weight, co2],
    );

    return success(res, {}, "Pickup completed and payment credited");
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Get My Pickups ─────────────────────────────────────────────────────────
exports.myPickups = async (req, res) => {
  try {
    const { role, id } = req.user;
    const col = role === "company" ? "p.company_id" : "p.user_id";

    const [rows] = await pool.query(
      `
      SELECT p.*, l.title AS listing_title, co.name AS company_name, u.name AS customer_name,
             p.qr_code, p.scheduled_date, p.scheduled_slot
      FROM pickups p
      JOIN listings l  ON p.listing_id  = l.id
      JOIN companies co ON p.company_id = co.id
      JOIN users u      ON p.user_id    = u.id
      WHERE ${col} = ? ORDER BY p.created_at DESC
    `,
      [id],
    );

    return success(res, rows);
  } catch (err) {
    return error(res, err.message);
  }
};
