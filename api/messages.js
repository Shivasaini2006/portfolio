import fs from 'fs';
import path from 'path';

// Ephemeral storage path (serverless /tmp)
const DATA_FILE = path.join('/tmp', 'messages.json');

function readMessages() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('Failed to read messages:', e);
    return [];
  }
}

function writeMessages(msgs) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(msgs, null, 2));
  } catch (e) {
    console.error('Failed to write messages:', e);
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
  if (req.method === 'GET') {
    if (!verifyToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json(readMessages());
  }

  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body || {};
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'name, email and message are required' });
      }

      const msgs = readMessages();
      const newMsg = { id: Date.now(), name, email, message, createdAt: new Date().toISOString() };
      msgs.unshift(newMsg);
      writeMessages(msgs);

      const emailSent = await sendEmail(name, email, message, newMsg.createdAt);

      return res.status(201).json({ ok: true, message: 'Message saved', emailSent });
    } catch (e) {
      console.error('Message save error:', e);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
