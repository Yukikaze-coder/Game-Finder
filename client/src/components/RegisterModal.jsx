import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterModal({ onClose }) {
  const { register, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(email, password, fullName);
      onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-7 flex flex-col"
        style={{
          margin: "auto",
          boxSizing: "border-box",
          maxHeight: "calc(100vh - 32px)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-2 text-center">Create account</h2>
        <div className="text-gray-500 text-center mb-5">
          Already have an account?{" "}
          <button
            className="text-blue-600 underline cursor-pointer"
            onClick={onClose}
          >
            Sign in
          </button>
        </div>
        <div className="mb-6">
          <div className="mb-2 font-semibold text-xs text-gray-600 text-left">QUICKLY SIGN UP WITH</div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 mb-3 font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.65 1.22 9.14 3.61l6.81-6.81C36.54 2.36 30.81 0 24 0 14.77 0 6.71 5.51 2.69 13.44l7.98 6.19C13.07 13.18 18.14 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.09 24.59c0-1.64-.15-3.22-.44-4.74H24v9.07h12.48c-.54 2.9-2.19 5.35-4.68 7.01l7.21 5.61C43.36 37.73 46.09 31.74 46.09 24.59z"/>
                <path fill="#FBBC05" d="M10.67 28.36A14.49 14.49 0 0 1 9.5 24c0-1.53.26-3.01.72-4.36l-7.98-6.19A23.982 23.982 0 0 0 0 24c0 3.82.92 7.44 2.69 10.56l7.98-6.2z"/>
                <path fill="#EA4335" d="M24 47.5c6.49 0 11.93-2.15 15.91-5.83l-7.21-5.61c-2.01 1.36-4.57 2.16-8.7 2.16-5.86 0-10.93-3.68-12.82-8.94l-7.98 6.2C6.71 42.49 14.77 47.5 24 47.5z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-grow border-t border-gray-200" />
          <div className="text-xs text-gray-400 font-semibold">OR USE EMAIL</div>
          <div className="flex-grow border-t border-gray-200" />
        </div>
        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            className="input input-bordered w-full"
            autoComplete="name"
            required
            disabled={loading}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            autoComplete="username"
            required
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full pr-10"
              required
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-0 right-0 h-full px-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    showPassword
                      ? "M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-6-9-7s4-7 9-7c1.06 0 2.077.202 3.023.563"
                      : "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-1.505 0-2.933-.263-4.192-.74"
                  }
                />
                {!showPassword && (
                  <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={2} />
                )}
              </svg>
            </button>
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
          <button
            disabled={loading}
            type="submit"
            className="btn btn-secondary w-full"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
