const express = require("express");
const router = express.Router();
const {getMe, signup, login} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/signup", signup)
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
module.exports = router;