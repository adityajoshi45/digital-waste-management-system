const pool = require("../config/db");
const { success, error } = require("../utils/apiResponse");

exports.getWallet = async (req, res) => {
  try {
    const [[user]] = await pool.query(
      "SELECT wallet_balance FROM users WHERE id = ?",
      [req.user.id],
    );
    const [transactions] = await pool.query(
      "SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      [req.user.id],
    );
    return success(res, { balance: user.wallet_balance, transactions });
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getImpact = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM impact_records WHERE user_id = ?",
      [req.user.id],
    );
    return success(
      res,
      rows[0] || { total_weight: 0, co2_saved: 0, items_count: 0 },
    );
  } catch (err) {
    return error(res, err.message);
  }
};
