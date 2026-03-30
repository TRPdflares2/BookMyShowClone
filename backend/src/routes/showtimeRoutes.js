const express = require("express");
const router = express.Router();
const {
  createShowtime,
  getShowtimes,
  getShowtimeById,
  getShowtimeSeats,
  deleteShowtime
} = require("../controllers/showtimeController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
router.post("/", authMiddleware, adminMiddleware, createShowtime);
router.get("/",authMiddleware,getShowtimes);
router.get("/:id", authMiddleware, getShowtimeById);
router.get("/:id/seats", authMiddleware, getShowtimeSeats);
router.delete("/:id",authMiddleware,adminMiddleware, deleteShowtime);
module.exports = router;
