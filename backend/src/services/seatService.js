const prisma = require("../config/prisma");
exports.generateSeatsForShowtime = async (showtimeId) => {
  const rows = ["A", "B", "C", "D"];
  const seatsPerRow = 10;

  const seats = [];

  for (let row of rows) {
    for (let num = 1; num <= seatsPerRow; num++) {
      let type = "SILVER";

      // 🎯 simple pricing logic
      if (row === "A") type = "RECLINER";
      else if (row === "B") type = "GOLD";

      seats.push({
        showtimeId,
        row,
        number: num,
        type,
        status: "AVAILABLE",
      });
    }
  }

  await prisma.seat.createMany({ data: seats });
};
