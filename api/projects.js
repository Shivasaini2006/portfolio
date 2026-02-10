const { connectDB } = require('./_db');
const Project = require('../backend/server/models/Project');

function verifyToken(req) {
  const token = req.headers['x-admin-token'];
  return !!token;
}

module.exports = async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.status(200).json(projects);
    } catch (error) {
      console.error('Get projects error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    if (!verifyToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { title, description, image, liveLink, githubLink, technologies, featured } = req.body || {};
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      const newProject = new Project({
        title,
        description,
        image: image || '',
        liveLink: liveLink || '',
        githubLink: githubLink || '',
        technologies: technologies || [],
        featured: featured || false
      });

      await newProject.save();
      return res.status(201).json({ ok: true, project: newProject });
    } catch (error) {
      console.error('Create project error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
