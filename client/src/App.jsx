import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-base-200">
        <BrowserRouter>
          <Navbar className="sticky top-0 z-50" />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:id" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}
export default App;
