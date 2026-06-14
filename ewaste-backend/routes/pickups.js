const router = require("express").Router();
const {
  schedulePickup,
  completePickup,
  myPickups,
} = require("../controllers/pickupController");
const { protect, isCompany } = require("../middleware/auth");

router.get("/", protect, myPickups);
router.post("/", protect, isCompany, schedulePickup);
router.patch("/:pickup_id/complete", protect, isCompany, completePickup);

module.exports = router;
