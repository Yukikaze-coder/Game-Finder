require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const favoritesRouter = require('./routes/favorites');
const authenticateToken = require('./auth'); 
const admin = require('firebase-admin');

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/favorites', favoritesRouter);


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test endpoint
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Test DB connection
app.get('/api/test-db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api/search', async (req, res) => {
  const { q, resource } = req.query;
  if (!q || !resource) return res.status(400).json({ error: 'Missing q or resource' });
  try {
    const apiKey = process.env.GIANTBOMB_API_KEY;
    const url = `https://www.giantbomb.com/api/search/?api_key=${apiKey}&format=json&query=${encodeURIComponent(q)}&resources=${encodeURIComponent(resource)}`;
    const response = await fetch(url, { headers: { 'User-Agent': 'GameFinderApp/1.0' } });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/game/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const apiKey = process.env.GIANTBOMB_API_KEY;
    const url = `https://www.giantbomb.com/api/game/${id}/?api_key=${apiKey}&format=json`;
    const response = await fetch(url, { headers: { 'User-Agent': 'GameFinderApp/1.0' } });
    const data = await response.json();

    // Log the full API response
    console.log("GIANTBOMB API RESPONSE:", JSON.stringify(data, null, 2));

    if (data && data.results) {
      res.json({ results: data.results });
    } else {
      console.log("No results found for id:", id); // Log for debugging
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (err) {
    console.error("ERROR in /api/game/:id:", err); // THIS LOG IS IMPORTANT!
    res.status(500).json({ error: err.message });
  }
});

