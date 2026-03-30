module.exports = {
  apps: [
    {
      name: "backend",
      script: "src/server.js",
      watch: true,
      ignore_watch: ["node_modules", "prisma"],
      env: {
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/movie_db",
        JWT_SECRET: "supersecretkey123",
      },
    },
  ],
};
