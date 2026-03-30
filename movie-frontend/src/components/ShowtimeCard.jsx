function ShowtimeCard({ showtime }) {
  return <div>{showtime?.time || "Showtime"}</div>;
}

export default ShowtimeCard;
