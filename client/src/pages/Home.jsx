import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { api } from '../api';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../contexts/AuthContext';
import RecentGamesCarousel from "../components/Carousel";

export default function Home() {
  const { currentUser } = useAuth(); 

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
      if (!currentUser) {
        alert('Please log in to save favorites.');
        return;
      }
      // Always get a fresh ID token from Firebase Auth
      const token = await currentUser.getIdToken();
      await api.post(
        '/favorites',
        {
          game_id: item.id,
          game_name: item.name,
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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Recent games carousel */}
      <RecentGamesCarousel />
      {/* Add margin below the carousel */}
      <div className="mb-8" />
      {/* Search bar below the carousel */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        resource={resource}
        setResource={setResource}
        loading={loading}
        handleSearch={handleSearch}
      />
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