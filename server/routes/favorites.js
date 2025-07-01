const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Get a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware to extract user from Firebase Admin (we'll add later)
function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Get user's favorites
router.get('/', requireUser, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT f.game_id, f.game_name FROM favorites f
      JOIN users u ON u.id = f.user_id
      WHERE u.firebase_uid = $1`,
      [req.user.uid]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a favorite
router.post('/', requireUser, async (req, res) => {
  const { game_id, game_name } = req.body;
  if (!game_id || !game_name) {
    return res.status(400).json({ error: 'Missing game_id or game_name' });
  }
  try {
    // Find user id or insert user if not exists
    let user = await pool.query('SELECT id FROM users WHERE firebase_uid=$1', [req.user.uid]);
    let user_id;
    if (user.rowCount === 0) {
      // Create user
      let insert = await pool.query(
        'INSERT INTO users (firebase_uid, email, display_name) VALUES ($1, $2, $3) RETURNING id',
        [req.user.uid, req.user.email, req.user.name || null]
      );
      user_id = insert.rows[0].id;
    } else {
      user_id = user.rows[0].id;
    }
    // Insert favorite
    await pool.query(
      'INSERT INTO favorites (user_id, game_id, game_name) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [user_id, game_id, game_name]
    );
    res.status(201).json({ message: 'Favorite added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a favorite
router.delete('/:game_id', requireUser, async (req, res) => {
  const { game_id } = req.params;
  try {
    let user = await pool.query('SELECT id FROM users WHERE firebase_uid=$1', [req.user.uid]);
    if (user.rowCount === 0) return res.status(400).json({ error: 'User not found' });
    let user_id = user.rows[0].id;
    await pool.query('DELETE FROM favorites WHERE user_id=$1 AND game_id=$2', [user_id, game_id]);
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
