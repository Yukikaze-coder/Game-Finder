import React, { useState } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";
import gamefinderLogo from "../assets/gamefinder.png"; 
import UserDropdown from "./UserDropDown";
import { Link } from "react-router-dom";

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
      <nav className="navbar bg-base-100 px-4 shadow-md">
        <div className="flex-1">
          <Link to="/"> {/* Wrap logo in Link */}
            <img
              src={gamefinderLogo}
              alt="Game Finder Logo"
              style={{ height: "80px", width: "120px", maxHeight: "150px", maxWidth: "150px", cursor: "pointer" }}
              className="inline-block mr-2"
            />
          </Link>
        </div>
        <div className="flex-none gap-2">
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