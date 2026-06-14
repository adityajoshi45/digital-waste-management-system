const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.get(
  "/dashboard",
  auth.protect,
  auth.isAdmin,
  adminController.getDashboard,
);
router.get(
  "/companies/pending",
  auth.protect,
  auth.isAdmin,
  adminController.getPendingCompanies,
);
router.patch(
  "/companies/:id/verify",
  auth.protect,
  auth.isAdmin,
  adminController.verifyCompany,
);
router.patch(
  "/users/:id/toggle",
  auth.protect,
  auth.isAdmin,
  adminController.toggleUser,
);
router.get(
  "/listings",
  auth.protect,
  auth.isAdmin,
  adminController.getAllListings,
);

module.exports = router;
