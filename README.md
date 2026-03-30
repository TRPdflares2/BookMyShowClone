AUTH
POST /auth/signup
POST /auth/login
GET  /auth/me

MOVIES
GET    /movies
GET    /movies/:id
POST   /movies
PUT    /movies/:id
DELETE /movies/:id

SHOWTIMES
POST   /showtimes
GET    /movies/:id/showtimes
GET    /showtimes/:id

SEATS
GET /showtimes/:id/seats

RESERVATIONS
POST   /reservations
GET    /reservations/my
DELETE /reservations/:id

ADMIN
GET /reservations

Admin created: {
  id: 2,
  email: 'admin@movie.com',
  password: '$2b$10$QiHQ5VxddYEAOILNS92EQeZqRShPvHtC8hg7EfpEjmhsxJ6JMyZ/u',
  role: 'ADMIN',
  createdAt: 2026-03-12T08:09:54.010Z
}