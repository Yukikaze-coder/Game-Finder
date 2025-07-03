import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import RelatedGames from "../components/RelatedGames";

export default function SearchPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [relatedGames, setRelatedGames] = useState([]);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/game/${id}`);
        setGame(res.data.results || null);

        
        if (res.data.results?.similar_games?.length) {
          const related = await Promise.all(
            res.data.results.similar_games.map(async (g) => {
              try {
                
                const detail = await api.get(`/game/${g.id}`);
                return detail.data.results;
              } catch {
                return g; 
              }
            })
          );
          setRelatedGames(related);
        } else {
          setRelatedGames([]);
        }
      } catch {
        setGame(null);
        setRelatedGames([]);
      }
      setLoading(false);
    };
    fetchGame();
  }, [id]);

  const handleFavorite = async () => {
    if (!currentUser) {
      alert('Please log in to save favorites.');
      return;
    }
    setSaving(true);
    try {
      const token = await currentUser.getIdToken();
      await api.post(
        '/favorites',
        {
          game_id: game.id,
          game_name: game.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Game saved to favorites!');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Please log in to save favorites.');
      } else {
        alert('Error saving favorite.');
      }
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-16">Loading game info...</div>;
  if (!game) return <div className="text-center py-16 text-error">Game not found.</div>;

  return (
    <div className="w-full min-h-screen bg-base-200 p-10 m-0 rounded-xl overflow-x-hidden">
      <div className="bg-base-100 shadow-xl rounded-xl w-full p-4">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold mb-3 text-center">{game.name}</h2>
          {game.image?.medium_url && (
            <img
              src={game.image.medium_url}
              alt={game.name}
              className="rounded-lg mb-4 w-full max-w-sm mx-auto object-cover"
              style={{ maxHeight: 700, maxWidth: 500 }}
            />
          )}
          
          <div className="flex gap-2 mb-2">
            <button
              className="btn btn-outline btn-secondary btn-sm"
              onClick={handleFavorite}
              disabled={saving}
            >
              {saving ? "Saving..." : "❤️ Save to Favorites"}
            </button>
            {game.site_detail_url && (
              <a
                href={game.site_detail_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-info btn-sm"
              >
                🔗Link
              </a>
            )}
          </div>
        </div>

        <div className="mt-2 w-full">
          <table className="table table-zebra w-full">
            <tbody>
              <tr>
                <td className="font-semibold w-36 sm:w-48">Release Date</td>
                <td>{game.original_release_date || "Unknown"}</td>
              </tr>
              <tr>
                <td className="font-semibold">Platforms</td>
                <td>{game.platforms?.map(p => p.name).join(", ") || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold">Genres</td>
                <td>{game.genres?.map(g => g.name).join(", ") || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold">Developers</td>
                <td>{game.developers?.map(d => d.name).join(", ") || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-semibold">Publishers</td>
                <td>{game.publishers?.map(p => p.name).join(", ") || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <div className="font-semibold mb-1">Description:</div>
          <div
            className="prose prose-slate w-full"
            style={{
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{
              __html: (game.description || game.deck || "No description.")
                .replace(
                  /<img /g,
                  '<img style="display:block;max-width:100%;" class="rounded-lg" '
                ),
            }}
          />
        </div>
        <RelatedGames relatedGames={relatedGames} />
      </div>
    </div>
  );
}