const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'shivasaini1938@gmail.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = crypto.createHmac('sha256', JWT_SECRET).update(`${email}:${Date.now()}`).digest('hex');
      return res.status(200).json({ ok: true, token, email });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
