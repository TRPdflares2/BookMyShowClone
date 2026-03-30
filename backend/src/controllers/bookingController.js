const prisma = require("../config/prisma");

// 🧾 CREATE PENDING BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { showtimeId, seats, totalAmount } = req.body;
    const userId = req.user.id;

    if (!showtimeId || !seats || seats.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        showtimeId,
        totalAmount,
        seatsJson: seats,
        status: "PENDING",
      },
    });

    res.status(201).json({
      message: "Booking created",
      booking,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CONFIRM BOOKING AFTER PAYMENT
exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    if (!bookingId) {
      return res.status(400).json({ message: "Missing bookingId" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const seats = booking.seatsJson;

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED" },
      });

      for (let seat of seats) {
        const updated = await tx.seat.updateMany({
          where: {
            showtimeId: booking.showtimeId,
            row: seat.row,
            number: seat.number,
            status: "LOCKED",
            lockedBy: userId,
          },
          data: {
            status: "BOOKED",
            lockedAt: null,
            lockedBy: null,
          },
        });

        if (updated.count === 0) {
          throw new Error(`Seat ${seat.row}${seat.number} cannot be booked`);
        }
      }
    });

    res.status(200).json({ message: "Booking confirmed" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 👤 GET MY BOOKINGS
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        showtime: {
          include: {
            movie: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
