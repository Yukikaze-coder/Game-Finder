import React, { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

export default function RecentGamesCarousel() {
  const [games, setGames] = useState([]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Use a common word to get a large list
    api
      .get("/search", {
        params: { q: "console", resource: "game" },
      })
      .then((res) => setGames((res.data.results || []).slice(0, 50)))
      .catch(() => setGames([]));
  }, []);

  useEffect(() => {
    if (!games.length) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % games.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [games.length]);

  const handleMouseEnter = () => clearInterval(intervalRef.current);
  const handleMouseLeave = () => {
    if (!games.length) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % games.length);
    }, 3000);
  };

  if (!games.length) return null;

  return (
    <div
      className="carousel w-full rounded-xl mt-10 shadow-lg bg-base-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {games.map((game, i) => (
        <div
          key={game.id}
          className={`carousel-item relative w-full transition-all duration-700 ${
            i === index ? "block" : "hidden"
          }`}
          style={{ height: 320 }}
        >
          <Link to={`/game/${game.guid}`} className="w-full flex flex-col items-center">
            <img
              src={game.image?.medium_url}
              alt={game.name}
              className="w-full h-60 object-contain rounded-lg mx-auto"
              style={{ background: "#20283c" }}
            />
            <div className="mt-3 font-bold text-base text-center text-base-content">
              {game.name}
            </div>
          </Link>
          <div className="absolute left-3 right-3 top-1/2 flex -translate-y-1/2 transform justify-between">
            <button
              className="btn btn-circle btn-sm"
              onClick={e => {
                e.stopPropagation();
                setIndex((index - 1 + games.length) % games.length);
              }}
            >
              ❮
            </button>
            <button
              className="btn btn-circle btn-sm"
              onClick={e => {
                e.stopPropagation();
                setIndex((index + 1) % games.length);
              }}
            >
              ❯
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
