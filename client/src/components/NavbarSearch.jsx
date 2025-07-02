import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function NavbarSearch() {
  const [showInput, setShowInput] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Handle search icon click
  const handleIconClick = () => {
    if (window.innerWidth < 768) {
      setShowMobileModal(true);
    } else {
      setShowInput(true);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
    }
  };

  // Submits search to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await api.get('/search', { params: { q: query, resource: "game" } });
      setResults(res.data.results || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  // Hide input when it loses focus (desktop only)
  const handleBlur = () => {
    setTimeout(() => setShowInput(false), 200);
  };

  // Results list
  function ResultCards() {
    if (loading) return <div className="py-5 text-center">Searching...</div>;
    if (!results.length) return null;
    return (
      <div className="max-h-[60vh] overflow-auto mt-3 space-y-3">
        {results.map(item => (
          <div key={item.id} className="card card-bordered shadow-md">
            <div className="card-body flex flex-row items-center gap-4 p-3">
              {item.image?.medium_url && (
                <Link to={`/game/${item.guid}`}>
                  <img
                    src={item.image.medium_url}
                    alt={item.name}
                    className="rounded-lg w-20 h-20 object-cover"
                  />
                </Link>
              )}
              <div className="flex-1">
                <Link
                  to={`/game/${item.guid}`}
                  className="font-bold text-lg hover:underline"
                  onClick={() => {
                    setShowInput(false);
                    setShowMobileModal(false);
                    setResults([]);
                    setQuery("");
                  }}
                >
                  {item.name}
                </Link>
                <div className="text-sm text-gray-500">{item.deck}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop: Sliding search input with results
  function DesktopPanel() {
    return (
      <div
        className={`fixed top-6 right-32 z-50 transition-all duration-200 ${
          showInput ? "w-[420px] opacity-100" : "w-0 opacity-0 pointer-events-none"
        }`}
        style={{
          background: "white",
          boxShadow: "0 2px 16px #0002",
          borderRadius: 12,
          padding: showInput ? "1.5rem" : 0,
          display: window.innerWidth < 768 ? "none" : "block",
          overflow: "hidden",
        }}
      >
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="input input-bordered w-full"
            placeholder="Search games..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onBlur={handleBlur}
          />
        </form>
        <ResultCards />
      </div>
    );
  }

  // Mobile: Modal with search input and results
  function MobileModal() {
    return showMobileModal ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={() => setShowMobileModal(false)}
      >
        <div
          className="bg-white p-5 rounded-xl shadow-lg w-11/12 max-w-xs flex flex-col gap-3"
          onClick={e => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <input
              className="input input-bordered w-full"
              placeholder="Search games..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
          </form>
          <ResultCards />
          <button
            className="btn btn-sm btn-ghost mt-2"
            onClick={() => setShowMobileModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    ) : null;
  }

  return (
    <>
      {/* Magnifying glass button */}
      <button
        className="btn btn-ghost btn-circle mx-1"
        aria-label="Quick search"
        onClick={handleIconClick}
        type="button"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <line x1="16" y1="16" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      {DesktopPanel()}
      {MobileModal()}
    </>
  );
}
