const pool = require("../config/db");
const { success, error } = require("../utils/apiResponse");

exports.submitRating = async (req, res) => {
  try {
    const { pickup_id, score, review } = req.body;
    const user_id = req.user.id;

    const [rows] = await pool.query(
      "SELECT * FROM pickups WHERE id = ? AND user_id = ? AND status = 'completed'",
      [pickup_id, user_id],
    );
    if (!rows.length) return error(res, "Completed pickup not found", 404);

    await pool.query(
      `INSERT INTO ratings (pickup_id, user_id, company_id, score, review) VALUES (?, ?, ?, ?, ?)`,
      [pickup_id, user_id, rows[0].company_id, score, review],
    );

    return success(res, {}, "Rating submitted", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getCompanyRatings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT r.score, r.review, r.created_at, u.name AS customer_name
      FROM ratings r JOIN users u ON r.user_id = u.id
      WHERE r.company_id = ? ORDER BY r.created_at DESC
    `,
      [req.params.company_id],
    );

    return success(res, rows);
  } catch (err) {
    return error(res, err.message);
  }
};
