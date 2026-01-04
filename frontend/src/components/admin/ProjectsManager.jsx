import React from 'react'

export default function ProjectsManager() {
  const [projects, setProjects] = React.useState([])
  const [showForm, setShowForm] = React.useState(false)
  const [editingProject, setEditingProject] = React.useState(null)
  const [imagePreview, setImagePreview] = React.useState('')
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    image: '',
    liveLink: '',
    githubLink: '',
    technologies: '',
    featured: false
  })

  React.useEffect(() => {
    loadProjects()
    migrateLocalStorageProjects()
  }, [])

  async function migrateLocalStorageProjects() {
    // One-time migration from localStorage to server
    const localProjects = localStorage.getItem('portfolioProjects')
    if (localProjects) {
      try {
        const projects = JSON.parse(localProjects)
        if (projects.length > 0) {
          const token = localStorage.getItem('adminToken')
          if (token) {
            console.log('Migrating', projects.length, 'projects from localStorage to server...')
            for (const project of projects) {
              await fetch('/api/projects', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-admin-token': token
                },
                body: JSON.stringify(project)
              })
            }
            console.log('Migration complete!')
            // Remove from localStorage after successful migration
            localStorage.removeItem('portfolioProjects')
            await loadProjects()
          }
        }
      } catch (error) {
        console.error('Migration error:', error)
      }
    }
  }

  async function loadProjects() {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        console.error('Failed to load projects')
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  async function saveProject(projectData) {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      alert('Please login first')
      return false
    }

    try {
      const isEdit = projectData.id && projects.find(p => p.id === projectData.id)
      const url = isEdit ? `/api/projects/${projectData.id}` : '/api/projects'
      const method = isEdit ? 'PUT' : 'POST'
      
      console.log('Saving project:', { url, method, hasToken: !!token, projectData })
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(projectData)
      })

      if (response.ok) {
        await loadProjects()
        // Dispatch custom event to notify the Projects component
        window.dispatchEvent(new Event('projectsUpdated'))
        return true
      } else {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        alert(errorData.error || 'Failed to save project')
        return false
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project: ' + error.message)
      return false
    }
  }

  async function deleteProject(projectId) {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      alert('Please login first')
      return false
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': token
        }
      })

      if (response.ok) {
        await loadProjects()
        // Dispatch custom event to notify the Projects component
        window.dispatchEvent(new Event('projectsUpdated'))
        return true
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete project')
        return false
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
      return false
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 1MB file = ~1.3MB base64)
      if (file.size > 1024 * 1024) {
        alert('Image size should be less than 1MB. Please compress your image or use an image URL instead.')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        // Base64 is ~33% larger than original file
        const base64Size = base64String.length
        if (base64Size > 2 * 1024 * 1024) {
          alert('Encoded image too large. Please use a smaller image or paste an image URL instead.')
          return
        }
        setFormData({...formData, image: base64String})
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    
    const techArray = formData.technologies.split(',').map(t => t.trim()).filter(t => t)
    const projectData = {
      id: editingProject ? editingProject.id : undefined,
      title: formData.title,
      description: formData.description,
      image: formData.image,
      liveLink: formData.liveLink,
      githubLink: formData.githubLink,
      technologies: techArray,
      featured: formData.featured,
      createdAt: editingProject ? editingProject.createdAt : undefined
    }

    saveProject(projectData).then(success => {
      if (success) {
        resetForm()
      }
    })
  }

  function handleEdit(project) {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      liveLink: project.liveLink,
      githubLink: project.githubLink,
      technologies: project.technologies.join(', '),
      featured: project.featured || false
    })
    setImagePreview(project.image)
    setShowForm(true)
  }

  function handleDelete(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId)
    }
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      image: '',
      liveLink: '',
      githubLink: '',
      technologies: '',
      featured: false
    })
    setImagePreview('')
    setEditingProject(null)
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-yellow-50">Manage Projects</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 accent-gradient text-black rounded-xl hover:shadow-xl transition font-medium btn-gold-glow flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {showForm ? 'Cancel' : 'Add New Project'}
        </button>
      </div>

      {/* Project Form */}
      {showForm && (
        <div className="glass p-6 rounded-xl border border-yellow-900/20 mb-6 animate-fadeInUp">
          <h3 className="text-lg font-semibold text-yellow-50 mb-4">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h3>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-yellow-100/70 mb-2">Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-yellow-900/30 bg-black/40 text-yellow-50 rounded-xl focus:border-yellow-500 focus:outline-none transition placeholder-yellow-100/50"
                  placeholder="My Awesome Project"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-yellow-100/70 mb-2">Project Image</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={e => {
                      setFormData({...formData, image: e.target.value})
                      setImagePreview(e.target.value)
                    }}
                    className="w-full px-4 py-3 border-2 border-yellow-900/30 bg-black/40 text-yellow-50 rounded-xl focus:border-yellow-500 focus:outline-none transition placeholder-yellow-100/50"
                    placeholder="https://example.com/image.jpg or paste image URL"
                  />
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 border-t border-yellow-900/30"></div>
                    <span className="text-xs text-yellow-100/50">OR</span>
                    <div className="flex-1 border-t border-yellow-900/30"></div>
                  </div>
                  <label className="cursor-pointer block">
                    <div className="w-full px-4 py-3 border-2 border-yellow-900/30 bg-black/40 text-yellow-100/70 rounded-xl hover:border-yellow-500 transition flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      Upload Image (max 1MB)
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-yellow-900/30">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({...formData, image: ''})
                        setImagePreview('')
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-yellow-100/70 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-yellow-900/30 bg-black/40 text-yellow-50 rounded-xl focus:border-yellow-500 focus:outline-none transition placeholder-yellow-100/50"
                placeholder="Brief description of your project..."
                rows="3"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-yellow-100/70 mb-2">Live Link</label>
                <input
                  type="url"
                  value={formData.liveLink}
                  onChange={e => setFormData({...formData, liveLink: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-yellow-900/30 bg-black/40 text-yellow-50 rounded-xl focus:border-yellow-500 focus:outline-none transition placeholder-yellow-100/50"
                  placeholder="https://myproject.com"
                />
              </div>

              <div>
                <label className="block text-sm text-yellow-100/70 mb-2">GitHub Link</label>
                <input
                  type="url"
                  value={formData.githubLink}
                  onChange={e => setFormData({...formData, githubLink: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-yellow-900/30 bg-black/40 text-yellow-50 rounded-xl focus:border-yellow-500 focus:outline-none transition placeholder-yellow-100/50"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-yellow-100/70 mb-2">Technologies (comma separated) *</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={e => setFormData({...formData, technologies: e.target.value})}
                className="w-full px-4 py-3 border-2 border-yellow-900/30 bg-black/40 text-yellow-50 rounded-xl focus:border-yellow-500 focus:outline-none transition placeholder-yellow-100/50"
                placeholder="React, Node.js, MongoDB, Tailwind CSS"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={e => setFormData({...formData, featured: e.target.checked})}
                className="w-5 h-5 rounded border-yellow-900/30 bg-black/40 text-yellow-500 focus:ring-yellow-500"
              />
              <label htmlFor="featured" className="text-sm text-yellow-100/70">
                Mark as Featured Project
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 accent-gradient text-black rounded-xl hover:shadow-xl transition font-medium btn-gold-glow"
              >
                {editingProject ? 'Update Project' : 'Add Project'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-yellow-900/30 text-yellow-50 rounded-xl hover:bg-yellow-900/20 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl border border-yellow-900/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-yellow-100/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-yellow-100/70">No projects yet. Add your first project!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass rounded-xl overflow-hidden border border-yellow-900/20 hover:border-yellow-700/30 transition group">
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 overflow-hidden">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-yellow-100/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                    FEATURED
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-yellow-50 mb-2">{project.title}</h3>
                <p className="text-sm text-yellow-100/70 mb-3 line-clamp-2">{project.description}</p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-yellow-900/30 border border-yellow-700/30 text-yellow-200 rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-2 mb-4">
                  {project.liveLink && (
                    <a 
                      href={project.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {project.githubLink && (
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-yellow-900/20">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 px-4 py-2 border border-yellow-900/30 text-yellow-50 rounded-lg hover:bg-yellow-900/20 transition text-sm flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-600/30 transition text-sm flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
