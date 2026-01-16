// MongoDB-based message handler for serverless deployment
const mongoose = require('mongoose');

// Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// MongoDB connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

function verifyToken(req) {
  const token = req.headers['x-admin-token'];
  return !!token; // Placeholder auth; replace for production
}

async function sendEmail(name, email, message, timestamp) {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) {
    return false;
  }
  
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      subject: `New portfolio contact from ${name}`,
      html: `<h2>New Contact Message</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${String(message).replace(/</g, '&lt;')}</p>
             <p><em>Received at ${new Date(timestamp).toLocaleString()}</em></p>`
    });
    return true;
  } catch (err) {
    console.error('Email send failed:', err);
    return false;
  }
}

export default async function handler(req, res) {
  // Connect to MongoDB
  await connectDB();

  if (req.method === 'GET') {
    if (!verifyToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body || {};
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'name, email and message are required' });
      }

      const newMessage = new Message({ name, email, message });
      await newMessage.save();

      const emailSent = await sendEmail(name, email, message, newMessage.createdAt);

      return res.status(201).json({ ok: true, message: 'Message saved', emailSent });
    } catch (e) {
      console.error('Message save error:', e);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
