import React from "react";

export default function MobileNavbarSearch({
  show,
  setShow,
  search,
  setSearch,
  onSearch,
  searchLoading,
}) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={() => setShow(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={() => setShow(false)}
          aria-label="Close"
        >
          ×
        </button>
        <input
          type="text"
          className="input input-bordered w-full mb-3"
          placeholder="Search games, characters, companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          disabled={searchLoading}
        />
        <button
          className="btn btn-primary w-full"
          onClick={onSearch}
          disabled={searchLoading}
        >
          {searchLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}
