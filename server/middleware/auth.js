const admin = require('firebase-admin'); 

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || null
    };
    next();
  } catch (err) {
    req.user = null;
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = authenticateToken;
