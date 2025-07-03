import React from "react";
import { Link } from "react-router-dom";

export default function RelatedGames({ relatedGames }) {
  if (!relatedGames?.length) return null;

  return (
    <div className="mt-10">
      <div className="font-semibold mb-4 text-lg">Related Games</div>
      <div className="flex flex-wrap gap-6 justify-start">
        {relatedGames.map((related) => {
          const imgSrc =
            related.image?.medium_url ||
            related.image?.icon_url ||
            related.image_url ||
            related.icon_url ||
            "";

          const publishers = related.publishers?.map(p => p.name).join(", ") || "Unknown";
          const releaseDate = related.original_release_date
            ? new Date(related.original_release_date).toLocaleDateString()
            : "Unknown";

          return (
            <div
              key={related.id || related.guid}
              className="card bg-base-200 shadow-lg rounded-xl w-72 p-5 flex flex-col items-center hover:scale-105 transition-transform duration-200"
              style={{ minHeight: 360 }}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={related.name}
                  className="rounded-lg mb-3 w-full h-44 object-cover bg-base-300"
                  style={{ maxWidth: "240px" }}
                />
              ) : (
                <div className="w-full h-44 mb-3 bg-base-300 rounded-lg flex items-center justify-center text-base-content/40">
                  No Image
                </div>
              )}
              <div className="font-bold text-center text-base mb-1 line-clamp-2">{related.name}</div>
              <div className="text-xs text-center text-base-content/60 mb-1">
                <span className="block">Publisher: {publishers}</span>
                <span className="block">Release: {releaseDate}</span>
              </div>
              <Link
                to={`/game/${related.id}`}
                className="btn btn-outline btn-primary btn-xs mt-auto"
              >
                View Details
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}