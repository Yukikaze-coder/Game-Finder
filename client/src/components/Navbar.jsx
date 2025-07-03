import React, { useState } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";
import gamefinderLogo from "../assets/gamefinder.png"; 
import UserDropdown from "./UserDropDown";
import { Link } from "react-router-dom";
import NavbarSearch from "./NavbarSearch";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); 

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      alert("Failed to log out");
    }
  };

  return (
    <>
      <nav className="navbar bg-blue-100 px-12 shadow-md sticky top-0 z-50">
        {/* Favorites link */}
        <div className="flex-1 flex justify-center">
          {currentUser && (
            <Link to="/favorites" className="btn btn-ghost ml-28" style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "0.04em" }}>
              ⭐Favorites
            </Link>
          )}
        </div>
        {/* Logo */}
        <div className="absolute left-0 pl-4 flex items-center h-full">
          <Link to="/">
            <img
              src={gamefinderLogo}
              alt="Game Finder Logo"
              style={{ height: "100px", width: "220px", maxHeight: "150px", maxWidth: "150px", cursor: "pointer" }}
              className="inline-block mr-2"
            />
          </Link>
        </div>
        {/* Magnifying glass + user controls */}
        <div className="flex items-center gap-2">
          <NavbarSearch />
          {!currentUser ? (
            <>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setAuthMode("register");
                  setShowAuthModal(true);
                }}
              >
                Register
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                }}
              >
                Sign In
              </button>
            </>
          ) : (
            <UserDropdown
              user={currentUser}
              avatarUrl={currentUser.photoURL}
              isGoogleUser={!!currentUser.providerData?.find(pd => pd.providerId === "google.com")}
              handleLogout={handleLogout}
            />
          )}
        </div>
      </nav>
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
