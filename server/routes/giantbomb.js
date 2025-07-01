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
