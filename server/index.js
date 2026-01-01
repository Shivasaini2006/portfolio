import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000
const DATA_FILE = path.join(__dirname, 'messages.json')
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'devtoken'

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

// Simple admin endpoint - requires x-admin-token header set to ADMIN_TOKEN
app.get('/api/messages', (req, res) => {
  const token = req.get('x-admin-token') || req.query.token
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const msgs = readMessages()
  res.json(msgs)
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  console.log(`Admin token: ${ADMIN_TOKEN} (set ADMIN_TOKEN env var to change)`)
})
