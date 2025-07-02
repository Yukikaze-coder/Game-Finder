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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(res.data || []);
      } catch {
        setFavorites([]);
      }
      setLoading(false);
    };
    if (currentUser) fetchFavorites();
  }, [currentUser]);

  // Fetch game details for images
  useEffect(() => {
    const fetchImages = async () => {
      if (!favorites.length) return;
      const token = await currentUser?.getIdToken();
      const updatedFavorites = await Promise.all(
        favorites.map(async (fav) => {
          try {
            // Fetch game details from your backend
            const res = await api.get(`/game/${fav.game_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return {
              ...fav,
              image: res.data?.results?.image?.medium_url || null,
            };
          } catch {
            return { ...fav, image: null };
          }
        })
      );
      setFavorites(updatedFavorites);
    };
    if (currentUser && favorites.length && !favorites[0].image) {
      fetchImages();
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
        <div className="alert alert-warning">You need to sign in to see your favorites.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Favorite Games</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center text-gray-500">No favorites yet.</div>
      ) : (
        <div className="grid gap-6">
          {favorites.map((fav) => (
            <div className="card card-bordered card-compact bg-base-100 shadow-md flex flex-row items-center gap-4" key={fav.game_id}>
              {fav.image && (
                <img
                  src={fav.image}
                  alt={fav.game_name}
                  className="w-24 h-24 object-cover rounded-lg ml-4"
                  style={{ minWidth: 96, minHeight: 96 }}
                />
              )}
              <div className="card-body flex-1">
                <h2 className="card-title">
                  <Link to={`/game/${fav.game_id}`} className="hover:underline">{fav.game_name}</Link>
                </h2>
                <button
                  className="btn btn-error btn-sm mt-2"
                  onClick={() => handleRemove(fav.game_id)}
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}