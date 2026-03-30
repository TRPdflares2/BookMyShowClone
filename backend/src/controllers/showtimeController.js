const prisma = require("../config/prisma");
const seatService = require("../services/seatService");
exports.createShowtime = async (req, res) => {
  try {
    const { movieId, startTime, screen } = req.body;

    if (!movieId || !startTime || !screen) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const showtime = await prisma.showtime.create({
      data: {
        movieId,
        startTime: new Date(startTime),
        screen,
      },
    });
    await seatService.generateSeatsForShowtime(showtime.id);
    res.status(201).json(showtime);
  } catch (err) {
    // 🔥 duplicate showtime
    if (err.code === "P2002") {
      return res.status(400).json({
        message: "A show is already scheduled on this screen at this time",
      });
    }

    // 🔥 foreign key issue
    if (err.code === "P2003") {
      return res.status(400).json({ message: "Invalid movieId" });
    }

    res.status(500).json({ error: err.message });
  }
};

exports.getShowtimes = async (req, res) => {
  try {
    const showtimes = await prisma.showtime.findMany({
      include: {
        movie: true,
      },
    });

    res.status(200).json(showtimes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getShowtimeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
      },
    });

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    res.status(200).json(showtime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getShowtimeSeats = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const seats = await prisma.seat.findMany({
      where: { showtimeId: id },
      orderBy: [{ row: "asc" }, { number: "asc" }],
    });

    const now = new Date();
    const lockExpiry = new Date(now.getTime() - 5 * 60 * 1000);

    const layout = {};

    for (let seat of seats) {
      let status = seat.status;
      if (
        seat.status === "LOCKED" &&
        seat.lockedAt &&
        seat.lockedAt < lockExpiry
      ) {
        status = "AVAILABLE";
      }

      if (!layout[seat.row]) layout[seat.row] = [];

      layout[seat.row].push({
        number: seat.number,
        status,
        type: seat.type,
      });
    }

    res.status(200).json({
      showtimeId: id,
      layout,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteShowtime = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await prisma.showtime.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    res.json({ message: "Showtime deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
