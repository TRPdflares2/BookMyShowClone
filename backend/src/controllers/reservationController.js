const prisma = require("../config/prisma");

// 🔒 LOCK SEATS
exports.lockSeats = async (req, res) => {
  const { showtimeId, seats } = req.body;
  const userId = req.user.id;

  if (!showtimeId || !seats || seats.length === 0) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const now = new Date();
  const lockExpiry = new Date(now.getTime() - 5 * 60 * 1000); // 5 min ago

  try {
    await prisma.$transaction(async (tx) => {
      for (let seat of seats) {
        const updated = await tx.seat.updateMany({
          where: {
            showtimeId,
            row: seat.row,
            number: seat.number,
            OR: [
              { status: "AVAILABLE" },
              {
                status: "LOCKED",
                lockedAt: { lt: lockExpiry },
              },
            ],
          },
          data: {
            status: "LOCKED",
            lockedAt: now,
            lockedBy: userId,
          },
        });

        if (updated.count === 0) {
          throw new Error(`Seat ${seat.row}${seat.number} not available`);
        }
      }
    });

    res.status(200).json({
      message: "Seats locked",
      expiresAt: new Date(now.getTime() + 5 * 60 * 1000),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🔓 RELEASE SEATS
exports.releaseSeats = async (req, res) => {
  const { showtimeId, seats } = req.body;
  const userId = req.user.id;

  if (!showtimeId || !seats || seats.length === 0) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (let seat of seats) {
        await tx.seat.updateMany({
          where: {
            showtimeId,
            row: seat.row,
            number: seat.number,
            status: "LOCKED",
            lockedBy: userId,
          },
          data: {
            status: "AVAILABLE",
            lockedAt: null,
            lockedBy: null,
          },
        });
      }
    });

    res.status(200).json({ message: "Seats released" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
