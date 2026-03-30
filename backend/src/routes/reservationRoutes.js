const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/lock", authMiddleware, reservationController.lockSeats);
router.post("/release", authMiddleware, reservationController.releaseSeats);

module.exports = router;
