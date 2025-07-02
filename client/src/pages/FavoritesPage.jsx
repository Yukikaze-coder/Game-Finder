import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites from backend
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const token = await currentUser?.getIdToken();
        const res = await api.get("/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data || []);
      } catch {
        setFavorites([]);
      }
      setLoading(false);
    };
    if (currentUser) fetchFavorites();
  }, [currentUser]);

  // Fetch game details for images/company/date
  useEffect(() => {
    const fetchDetails = async () => {
      if (!favorites.length) return;
      const token = await currentUser?.getIdToken();
      const updatedFavorites = await Promise.all(
        favorites.map(async (fav) => {
          try {
            const res = await api.get(`/game/${fav.game_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data?.results || {};
            return {
              ...fav,
              image: data.image?.medium_url || null,
              company:
                (data.developers && data.developers[0]?.name) ||
                (data.publishers && data.publishers[0]?.name) ||
                null,
              releaseDate: data.original_release_date || null,
            };
          } catch {
            return { ...fav, image: null, company: null, releaseDate: null };
          }
        })
      );
      setFavorites(updatedFavorites);
    };
    if (
      currentUser &&
      favorites.length &&
      (!favorites[0].image || !favorites[0].company)
    ) {
      fetchDetails();
    }
    // eslint-disable-next-line
  }, [favorites.length, currentUser]);

  const handleRemove = async (game_id) => {
    try {
      const token = await currentUser.getIdToken();
      await api.delete(`/favorites/${game_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter((fav) => fav.game_id !== game_id));
    } catch {
      alert("Failed to remove favorite.");
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <div className="alert alert-warning">
          You need to sign in to see your favorites.
        </div>
      </div>
    );
  }

  // Show latest favorite first
  const favoritesReversed = [...favorites].reverse();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        My Favorite Games
      </h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : favoritesReversed.length === 0 ? (
        <div className="text-center text-gray-500">No favorites yet.</div>
      ) : (
        <div className="grid gap-6">
          {favoritesReversed.map((fav) => (
            <div
              className="card card-bordered card-compact bg-base-100 shadow-md flex flex-row items-center gap-4"
              key={fav.game_id}
            >
              {fav.image && (
                <Link to={`/game/${fav.game_id}`}>
                  <img
                    src={fav.image}
                    alt={fav.game_name}
                    className="w-24 h-24 object-cover rounded-lg ml-4 hover:opacity-80 transition"
                    style={{ minWidth: 96, minHeight: 96 }}
                  />
                </Link>
              )}
              <div className="card-body flex-1">
                <h2 className="card-title mb-1">
                  <Link
                    to={`/game/${fav.game_id}`}
                    className="transition duration-200 hover:text-primary hover:scale-105"
                    style={{ display: "inline-block" }}
                  >
                    {fav.game_name}
                  </Link>
                </h2>
                <div className="text-xs text-gray-500 mb-1">
                  {fav.company && (
                    <>
                      <span className="font-semibold">Company:</span> {fav.company}
                    </>
                  )}
                  {fav.company && fav.releaseDate && <span> &nbsp;|&nbsp; </span>}
                  {fav.releaseDate && (
                    <>
                      <span className="font-semibold">Published:</span>{" "}
                      {new Date(fav.releaseDate).toLocaleDateString()}
                    </>
                  )}
                </div>
                <button
                  className="btn btn-error btn-xs mt-2 px-3"
                  style={{ minWidth: "60px" }}
                  onClick={() => handleRemove(fav.game_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}