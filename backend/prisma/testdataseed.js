const prisma = require("../src/config/prisma");
const seatService = require("../src/services/seatService");

async function main() {
  console.log("🌱 Seeding database...");

  // 👤 Users (as you asked)
  const admin = await prisma.user.create({
    data: {
      email: "x",
      password: "x",
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "y",
      password: "y",
      role: "USER",
    },
  });

  console.log("✅ Users created");

  // 🎬 Movies (more variety)
  const movies = await prisma.movie.createMany({
    data: [
      {
        title: "Interstellar",
        description: "Space exploration",
        genre: "Sci-Fi",
        duration: 169,
      },
      {
        title: "Inception",
        description: "Dream hacking",
        genre: "Sci-Fi",
        duration: 148,
      },
      {
        title: "Dark Knight",
        description: "Batman vs Joker",
        genre: "Action",
        duration: 152,
      },
      {
        title: "Avengers",
        description: "Superhero team-up",
        genre: "Action",
        duration: 143,
      },
    ],
  });

  console.log("✅ Movies created");

  // fetch movies (needed after createMany)
  const allMovies = await prisma.movie.findMany();

  // 🎟️ Create multiple showtimes
  const showtimes = [];

  for (let movie of allMovies) {
    const times = [
      "2026-03-25T10:00:00.000Z",
      "2026-03-25T14:00:00.000Z",
      "2026-03-25T18:00:00.000Z",
    ];

    for (let time of times) {
      const show = await prisma.showtime.create({
        data: {
          movieId: movie.id,
          startTime: new Date(time),
          screen: "Screen 1",
        },
      });

      showtimes.push(show);
    }
  }

  console.log("✅ Showtimes created:", showtimes.length);

  // 💺 Generate seats for all showtimes
  for (let show of showtimes) {
    await seatService.generateSeatsForShowtime(show.id);
  }

  console.log("✅ Seats generated for all showtimes");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
