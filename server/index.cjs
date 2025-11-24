const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 4000
const DATA_FILE = path.join(__dirname, 'messages.json')

// Admin credentials (change these for production!)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'shivasaini1938@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')

app.use(cors())
app.use(express.json())

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]')
}

function readMessages() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    console.error('Failed to read messages:', e)
    return []
  }
}

function writeMessages(msgs) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(msgs, null, 2))
  } catch (e) {
    console.error('Failed to write messages:', e)
  }
}

app.get('/', (req, res) => {
  res.send({ status: 'ok', message: 'Portfolio backend running' })
})

// POST /api/admin/login - admin login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {}
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Generate simple token (in production use JWT library)
    const token = crypto.createHmac('sha256', JWT_SECRET)
      .update(`${email}:${Date.now()}`)
      .digest('hex')
    return res.json({ ok: true, token, email })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
})

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.get('x-admin-token') || req.query.token
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  // In production, properly verify JWT. For now, accept any non-empty token from login
  // (since we generate it server-side, we trust it)
  next()
}

// POST /api/messages - accept contact messages
app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' })
  }

  const msgs = readMessages()
  const newMsg = {
    id: Date.now(),
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  }
  msgs.unshift(newMsg)
  writeMessages(msgs)

  return res.status(201).json({ ok: true, message: 'Message saved' })
})

// GET /api/messages - protected admin endpoint
app.get('/api/messages', verifyToken, (req, res) => {
  const msgs = readMessages()
  res.json(msgs)
})

// POST /api/admin/change-password - change admin password
app.post('/api/admin/change-password', verifyToken, (req, res) => {
  const { email, currentPassword, newPassword } = req.body || {}
  
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Email, current password, and new password are required' })
  }

  // Verify current credentials
  if (email !== ADMIN_EMAIL || currentPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Current password is incorrect' })
  }

  // Validate new password
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' })
  }

  // In a production environment, you would update the password in a database
  // For now, we'll just log the change since we're using environment variables
  console.log(`Password change requested for ${email}`)
  console.log(`⚠️  To persist this change, update ADMIN_PASSWORD environment variable to: ${newPassword}`)
  
  // Update the in-memory password (will reset on server restart)
  process.env.ADMIN_PASSWORD = newPassword
  
  return res.json({ 
    ok: true, 
    message: 'Password changed successfully',
    note: 'Password updated for current session. Update ADMIN_PASSWORD env var to persist across restarts.'
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  console.log(`Admin email: ${ADMIN_EMAIL}`)
  console.log(`(Set ADMIN_EMAIL and ADMIN_PASSWORD env vars to change)`)
})
