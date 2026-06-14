const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const auth = require("../middleware/auth");

router.get("/", auth.protect, auth.isCustomer, walletController.getWallet);
router.get(
  "/impact",
  auth.protect,
  auth.isCustomer,
  walletController.getImpact,
);

module.exports = router;
