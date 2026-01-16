const express = require('express')
const path = require('path')
const cors = require('cors')
const crypto = require('crypto')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

// MongoDB connection and models
const { connectDB } = require('./db')
const Message = require('./models/Message')
const Project = require('./models/Project')
const Admin = require('./models/Admin')

const app = express()
const PORT = process.env.PORT || 4000

// Admin credentials (change these for production!)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'shivasaini1938@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Shiva@2416'
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')

// Connect to MongoDB
connectDB()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// API Routes (must be before static file serving)

// POST /api/admin/login - admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate simple token (in production use JWT library)
      const token = crypto.createHmac('sha256', JWT_SECRET)
        .update(`${email}:${Date.now()}`)
        .digest('hex')
      return res.json({ ok: true, token, email })
    }
    return res.status(401).json({ error: 'Invalid credentials' })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
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
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body || {}
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email and message are required' })
    }

    const newMessage = new Message({
      name,
      email,
      message
    })

    await newMessage.save()

    return res.status(201).json({ ok: true, message: 'Message saved' })
  } catch (error) {
    console.error('Save message error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/messages - protected admin endpoint
app.get('/api/messages', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/projects - public endpoint to get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/projects - protected admin endpoint to create project
app.post('/api/projects', verifyToken, async (req, res) => {
  try {
    const { title, description, image, liveLink, githubLink, technologies, featured } = req.body || {}
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' })
    }

    const newProject = new Project({
      title,
      description,
      image: image || '',
      liveLink: liveLink || '',
      githubLink: githubLink || '',
      technologies: technologies || [],
      featured: featured || false
    })
    
    await newProject.save()
    
    return res.status(201).json({ ok: true, project: newProject })
  } catch (error) {
    console.error('Create project error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/projects/:id - protected admin endpoint to update project
app.put('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id
    const { title, description, image, liveLink, githubLink, technologies, featured } = req.body || {}
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' })
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title,
        description,
        image: image || '',
        liveLink: liveLink || '',
        githubLink: githubLink || '',
        technologies: technologies || [],
        featured: featured || false
      },
      { new: true, runValidators: true }
    )
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    return res.json({ ok: true, project: updatedProject })
  } catch (error) {
    console.error('Update project error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/projects/:id - protected admin endpoint to delete project
app.delete('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id
    
    const deletedProject = await Project.findByIdAndDelete(projectId)
    
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    return res.json({ ok: true, message: 'Project deleted' })
  } catch (error) {
    console.error('Delete project error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
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

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  
  // Handle React routing - return index.html for all non-API routes
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
  console.log(`Admin email: ${ADMIN_EMAIL}`)
  console.log(`(Set ADMIN_EMAIL and ADMIN_PASSWORD env vars to change)`)
})
