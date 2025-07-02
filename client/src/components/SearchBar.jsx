import React from "react";

export default function SearchBar({ query, setQuery, resource, setResource, loading, handleSearch }) {
  return (
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
  );
}