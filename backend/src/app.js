const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://book-my-show-clone-khaki.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.set("trust proxy", 1);
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/showtimes", showtimeRoutes);
app.get("/" ,(req ,res)=>{
    res.send("LANDING PAGE");

});
app.use("/reservations", reservationRoutes);
app.use("/bookings",bookingRoutes);
app.get("/health", (req, res) => {
  res.send("OK");
});
module.exports = app;