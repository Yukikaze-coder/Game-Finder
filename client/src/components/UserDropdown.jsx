import React from "react";
import { Link, useNavigate } from "react-router-dom";
import userLogo from "../assets/userlogo.png";

export default function UserDropdown({ user, avatarUrl, isGoogleUser, handleLogout }) {
  const navigate = useNavigate();

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-12 h-12">
          <img
            src={avatarUrl}
            alt="avatar"
            className="object-cover w-full h-full rounded-2xl"
            onError={(e) => {
              e.currentTarget.src = userLogo;
            }}
          />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content mt-3 p-4 shadow menu menu-sm bg-white rounded-box w-52 border border-blue-100 z-50"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar online">
            <div className="w-12 h-12">
              <img
                src={avatarUrl}
                alt="avatar"
                className="object-cover w-full h-full rounded-2xl"
                onError={(e) => {
                  e.currentTarget.src = userLogo;
                }}
              />
            </div>
          </div>
          <span className="font-semibold text-sm">{user.displayName || user.email}</span>
        </div>
        {!isGoogleUser && (
          <li>
            <button onClick={() => navigate("/profile")}>Profile Settings</button>
          </li>
        )}
        {/* <li>
          <Link to="/favorites">Favorites</Link>
        </li> */}
        <li>
          <button onClick={handleLogout}>Sign Out</button>
        </li>
      </ul>
    </div>
  );
}
