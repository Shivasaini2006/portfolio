const { connectDB } = require('../_db');
const Project = require('../../backend/server/models/Project');

function verifyToken(req) {
  const token = req.headers['x-admin-token'];
  return !!token;
}

module.exports = async function handler(req, res) {
  await connectDB();

  if (!verifyToken(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query || {};

  if (!id) {
    return res.status(400).json({ error: 'Project id is required' });
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, image, liveLink, githubLink, technologies, featured } = req.body || {};
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      const updatedProject = await Project.findByIdAndUpdate(
        id,
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
      );

      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.status(200).json({ ok: true, project: updatedProject });
    } catch (error) {
      console.error('Update project error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deletedProject = await Project.findByIdAndDelete(id);
      if (!deletedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.status(200).json({ ok: true, message: 'Project deleted' });
    } catch (error) {
      console.error('Delete project error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
