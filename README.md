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

