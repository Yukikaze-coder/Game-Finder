import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { api } from '../api';

export default function SearchPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/game/${id}`);
        setGame(res.data.results || null);
      } catch {
        setGame(null);
      }
      setLoading(false);
    };
    fetchGame();
  }, [id]);

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
              style={{ maxHeight: 350 }}
            />
          )}
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
      </div>
    </div>
  );
}