import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://game-finder-server.onrender.com/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Attach auth token if present (for logged-in users)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('firebaseToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
