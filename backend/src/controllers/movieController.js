const prisma = require("../config/prisma");
//////export createMovie
exports.createMovie = async (req, res) => {
  try {
    const { title, description, genre, duration } = req.body;
    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        genre,
        duration,
      },
    });
    res.status(201).json(movie);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({
        message: "Movie already exists",
      });
    }
    res.status(500).json({ error: err.message });
  }
};

/////export getMovies
exports.getMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//////export getMoviesById
exports.getMoviesById = async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/////export deleteMovie
exports.deleteMovie = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const movie = await prisma.movie.findUnique({
      where: { id },
    });
    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }
    await prisma.movie.delete({
      where: { id },
    });
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};