const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const RAWG_KEY = process.env.RAWG_API_KEY;

// Search RAWG games
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing q' });

  try {
    const url = `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(q)}&page_size=20`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RAWG Game details
router.get('/game/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const url = `https://api.rawg.io/api/games/${id}?key=${RAWG_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
