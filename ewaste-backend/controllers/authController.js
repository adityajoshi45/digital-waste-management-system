const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { success, error } = require("../utils/apiResponse");

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// ── Customer Register ──────────────────────────────────────────────────────
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, address, city, state, pincode } =
      req.body;

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length) return error(res, "Email already registered", 409);

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, address, city, state, pincode, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'customer')`,
      [name, email, hash, phone, address, city, state, pincode],
    );

    const token = generateToken({ id: result.insertId, role: "customer" });
    return success(
      res,
      { token, id: result.insertId, name, email, role: "customer" },
      "Registered successfully",
      201,
    );
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Company Register ───────────────────────────────────────────────────────
exports.registerCompany = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
      license_number,
      description,
    } = req.body;

    const [existing] = await pool.query(
      "SELECT id FROM companies WHERE email = ?",
      [email],
    );
    if (existing.length) return error(res, "Email already registered", 409);

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO companies (name, email, password_hash, phone, address, city, state, pincode, license_number, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        hash,
        phone,
        address,
        city,
        state,
        pincode,
        license_number,
        description,
      ],
    );

    const token = generateToken({ id: result.insertId, role: "company" });
    return success(
      res,
      { token, id: result.insertId, name, email, role: "company" },
      "Company registered. Await admin verification.",
      201,
    );
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Login (customers + admins) ─────────────────────────────────────────────
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows.length) return error(res, "Invalid credentials", 401);

    const user = rows[0];
    if (!user.is_active) return error(res, "Account disabled", 403);

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return error(res, "Invalid credentials", 401);

    const token = generateToken({ id: user.id, role: user.role });
    return success(res, {
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Login (companies) ──────────────────────────────────────────────────────
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM companies WHERE email = ?", [
      email,
    ]);
    if (!rows.length) return error(res, "Invalid credentials", 401);

    const company = rows[0];
    if (!company.is_active) return error(res, "Account disabled", 403);
    if (!company.is_verified)
      return error(res, "Account not yet verified by admin", 403);

    const match = await bcrypt.compare(password, company.password_hash);
    if (!match) return error(res, "Invalid credentials", 401);

    const token = generateToken({ id: company.id, role: "company" });
    return success(res, {
      token,
      id: company.id,
      name: company.name,
      email: company.email,
      role: "company",
    });
  } catch (err) {
    return error(res, err.message);
  }
};

// ── Get My Profile ─────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role === "company") {
      const [rows] = await pool.query(
        "SELECT id, name, email, phone, city, state, avg_rating, total_ratings, is_verified FROM companies WHERE id = ?",
        [id],
      );
      return success(res, rows[0]);
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, phone, city, state, wallet_balance, role FROM users WHERE id = ?",
      [id],
    );
    return success(res, rows[0]);
  } catch (err) {
    return error(res, err.message);
  }
};
