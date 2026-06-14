const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const [[{ total_users }]] = await pool.query(
      "SELECT COUNT(*) AS total_users FROM users WHERE role = 'customer'",
    );
    const [[{ total_companies }]] = await pool.query(
      "SELECT COUNT(*) AS total_companies FROM companies",
    );
    const [[{ total_listings }]] = await pool.query(
      "SELECT COUNT(*) AS total_listings FROM listings",
    );
    const [[{ total_pickups }]] = await pool.query(
      "SELECT COUNT(*) AS total_pickups FROM pickups",
    );
    const [[{ total_paid }]] = await pool.query(
      "SELECT COALESCE(SUM(amount),0) AS total_paid FROM wallet_transactions WHERE type = 'credit'",
    );

    return res.json({
      success: true,
      data: {
        total_users,
        total_companies,
        total_listings,
        total_pickups,
        total_paid,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getPendingCompanies = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, city, license_number, created_at FROM companies WHERE is_verified = 0",
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const verifyCompany = async (req, res) => {
  try {
    await pool.query("UPDATE companies SET is_verified = 1 WHERE id = ?", [
      req.params.id,
    ]);
    return res.json({ success: true, message: "Company verified" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const toggleUser = async (req, res) => {
  try {
    await pool.query(
      "UPDATE users SET is_active = NOT is_active WHERE id = ?",
      [req.params.id],
    );
    return res.json({ success: true, message: "User status updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllListings = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.id, l.title, l.status, l.city, l.created_at,
             u.name AS user_name, c.name AS category_name
      FROM listings l
      JOIN users u ON l.user_id = u.id
      JOIN categories c ON l.category_id = c.id
      ORDER BY l.created_at DESC LIMIT 100
    `);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboard,
  getPendingCompanies,
  verifyCompany,
  toggleUser,
  getAllListings,
};
