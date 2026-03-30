const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, bookingController.createBooking);
router.post("/confirm", authMiddleware, bookingController.confirmBooking);
router.get("/me", authMiddleware, bookingController.getMyBookings);

module.exports = router;
