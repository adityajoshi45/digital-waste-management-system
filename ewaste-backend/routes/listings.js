const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", auth.protect, listingController.getAllListings);
router.get("/my", auth.protect, auth.isCustomer, listingController.myListings);
router.get("/:id", auth.protect, listingController.getListing);
router.post(
  "/",
  auth.protect,
  auth.isCustomer,
  upload.array("images", 5),
  listingController.createListing,
);
router.patch(
  "/:id/cancel",
  auth.protect,
  auth.isCustomer,
  listingController.cancelListing,
);

module.exports = router;
