const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offerController");
const auth = require("../middleware/auth");

router.post("/", auth.protect, auth.isCompany, offerController.makeOffer);
router.get("/my", auth.protect, auth.isCompany, offerController.myOffers);
router.patch(
  "/:offer_id/accept",
  auth.protect,
  auth.isCustomer,
  offerController.acceptOffer,
);
router.patch(
  "/:offer_id/reject",
  auth.protect,
  auth.isCustomer,
  offerController.rejectOffer,
);

module.exports = router;
