const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register/customer", authController.registerCustomer);
router.post("/register/company", authController.registerCompany);
router.post("/login/user", authController.loginUser);
router.post("/login/company", authController.loginCompany);
router.get("/profile", auth.protect, authController.getProfile);

module.exports = router;
