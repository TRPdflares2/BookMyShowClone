const express = require("express");
const router = express.Router();
const {
  createMovie,
  getMovies,
  getMoviesById,
  deleteMovie,
} = require("../controllers/movieController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
router.post("/", authMiddleware, adminMiddleware, createMovie);
router.get("/",authMiddleware, getMovies);
router.get("/:id",authMiddleware, getMoviesById);
router.delete("/:id", authMiddleware,adminMiddleware, deleteMovie);
module.exports = router;
