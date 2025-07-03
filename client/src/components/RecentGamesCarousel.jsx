import React, { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

const VISIBLE = 20;
const IMAGE_WIDTH = 250;

export default function RecentGamesCarousel() {
  const [games, setGames] = useState([]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const transitionRef = useRef(true);

  useEffect(() => {
    api
      .get("/search", {
        params: { q: "fantasy", resource: "game" },
      })
      .then((res) =>
        setGames(
          (res.data.results || [])
            .filter((g) => g.image?.medium_url)
            .slice(0, 24)
        )
      )
      .catch(() => setGames([]));
  }, []);

  // Infinite loop logic
  useEffect(() => {
    if (!games.length) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
      transitionRef.current = true;
    }, 2000); // smoother, slower speed
    return () => clearInterval(intervalRef.current);
  }, [games.length]);

  // When reaching the duplicated slides, reset without transition for seamless loop
  useEffect(() => {
    if (index === games.length) {
      setTimeout(() => {
        transitionRef.current = false;
        setIndex(0);
      }, 500); // match transition duration
    }
  }, [index, games.length]);

  const handleMouseEnter = () => clearInterval(intervalRef.current);
  const handleMouseLeave = () => {
    if (!games.length) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
      transitionRef.current = true;
    }, 2000);
  };

  if (!games.length) return null;

  // Duplicate slides for infinite effect
  const extendedGames = [...games, ...games.slice(0, VISIBLE)];
  const translateX = -(index * IMAGE_WIDTH);

  return (
    <div
      className="w-full overflow-hidden rounded-xl mt-10 shadow-lg bg-base-200"
      style={{ height: 220 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex"
        style={{
          width: `${(games.length + VISIBLE) * IMAGE_WIDTH}px`,
          transform: `translateX(${translateX}px)`,
          transition: transitionRef.current
            ? "transform 0.7s cubic-bezier(0.4,0,0.2,1)"
            : "none",
        }}
      >
        {extendedGames.map((game, i) => (
          <Link
            key={game.id + "-" + i}
            to={`/game/${game.guid}`}
            className="block"
            style={{
              minWidth: IMAGE_WIDTH,
              maxWidth: IMAGE_WIDTH,
              height: 220,
              overflow: "hidden",
              borderRadius: "1rem",
              marginRight: 12,
              background: "#181e2a",
            }}
          >
            <img
              src={game.image.medium_url}
              alt={game.name}
              className="w-full h-full object-cover"
              style={{ display: "block", borderRadius: "1rem" }}
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}