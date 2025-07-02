import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { api } from '../api';

export default function Home() {
  const [query, setQuery] = useState('');
  const [resource, setResource] = useState('game');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    try {
      const res = await api.get('/search', { params: { q: query, resource } });
      setResults(res.data.results || []);
    } catch (err) {
      alert(err.response?.data?.error || 'Error searching!');
    }
    setLoading(false);
  };

  const handleFavorite = async (item) => {
    try {
      await api.post('/favorites', {
        game_id: item.id,
        game_name: item.name,
      });
      alert('Game saved to favorites!');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Please log in to save favorites.');
      } else {
        alert('Error saving favorite.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="flex flex-col gap-4 max-w-xl mx-auto">
        <input
          className="input input-bordered w-full"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search games, characters, companies..."
          required
        />
        <select
          className="select select-bordered"
          value={resource}
          onChange={e => setResource(e.target.value)}
        >
          <option value="game">Games</option>
          <option value="character">Characters</option>
          <option value="company">Companies</option>
          <option value="concept">Concepts</option>
        </select>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(item => (
          <div key={item.id} className="card card-bordered mb-4 shadow-md">
            <div className="card-body">
              <h2 className="card-title">
                <Link
                  to={`/game/${item.guid}`}
                  className="hover:underline"
                >
                  {item.name}
                </Link>
              </h2>
              
              {item.image?.medium_url && (
                <Link to={`/game/${item.guid}`}>
                  <img
                    src={item.image.medium_url}
                    alt={item.name}
                    className="rounded-lg mb-3 w-full max-w-xs mx-auto object-cover"
                    style={{ cursor: "pointer" }}
                  />
                </Link>
              )}
              <button
                className="btn btn-outline btn-secondary btn-sm mt-2"
                onClick={() => handleFavorite(item)}
              >
                Save to Favorites
              </button>
              <p>{item.deck}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
