const crypto = require('crypto');

// In-memory password store (non-persistent). Replace with DB / KV in production.
let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'shiva@2416';

function signToken(email) {
  const secret = process.env.AUTH_SECRET || 'dev-secret';
  return crypto
    .createHmac('sha256', secret)
    .update(email + Date.now())
    .digest('hex');
}

function verifyToken(req) {
  const token = req.headers['x-admin-token'];
  // Placeholder: in real app, verify against issued tokens stored server-side.
  return !!token;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!verifyToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { oldPassword, newPassword, email } = req.body || {};
  if (!oldPassword || !newPassword || !email) {
    return res.status(400).json({ error: 'oldPassword, newPassword and email required' });
  }

  if (oldPassword !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Old password incorrect' });
  }

  ADMIN_PASSWORD = newPassword; // Non-persistent change.
  const newToken = signToken(email);
  return res.status(200).json({ ok: true, message: 'Password changed (non-persistent in serverless).', token: newToken });
}
