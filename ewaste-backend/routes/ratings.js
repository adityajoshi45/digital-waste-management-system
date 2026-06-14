const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const auth = require("../middleware/auth");

router.post("/", auth.protect, auth.isCustomer, ratingController.submitRating);
router.get("/company/:company_id", ratingController.getCompanyRatings);

module.exports = router;
