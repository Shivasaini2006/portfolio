import React from 'react'

function TechPill({ name }) {
  return (
    <span className="text-xs px-3 py-1 bg-purple-900/30 rounded-full text-purple-200 font-medium border border-purple-700/30">
      {name}
    </span>
  )
}

export default function Projects() {
  const [projects, setProjects] = React.useState([])

  React.useEffect(() => {
    loadProjects()
    
    // Listen for project updates from admin panel
    const handleProjectsUpdate = () => {
      loadProjects()
    }
    
    window.addEventListener('projectsUpdated', handleProjectsUpdate)
    
    return () => {
      window.removeEventListener('projectsUpdated', handleProjectsUpdate)
    }
  }, [])

  async function loadProjects() {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        // Map MongoDB _id to id for compatibility
        const projectsWithId = data.map(project => ({
          ...project,
          id: project._id
        }))
        // Sort by featured first, then by creation date
        const sortedProjects = projectsWithId.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
        setProjects(sortedProjects)
      } else {
        console.error('Failed to load projects')
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3 gold-gradient-text">
              Selected Projects
            </h3>
            <p className="text-cyan-100/80">Check out some of my recent work</p>
          </div>
          <div className="text-center py-12 glass rounded-xl border border-purple-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-cyan-100/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-cyan-100/70">No projects yet. Add projects from the admin panel!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300 font-medium mb-4">
            💡 My Work
          </div>
          <h3 className="text-4xl md:text-5xl font-black gold-gradient-text">
            Featured Projects
          </h3>
          <p className="text-xl text-cyan-100/80 max-w-2xl mx-auto">Explore some of my recent work and side projects</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <article 
              key={project.id} 
              className="group relative glass rounded-3xl overflow-hidden hover:translate-y-[-12px] transform transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 border border-purple-900/30 hover:border-purple-500/50 fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                  ⭐ FEATURED
                </div>
              )}
              
              {/* Project Image */}
              <div className="w-full h-56 relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-green-800/30">
                {project.image ? (
                  <>
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-cyan-100/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Project Info */}
              <div className="p-6 space-y-4">
                <h4 className="font-bold text-2xl text-cyan-50 group-hover:gold-gradient-text transition-all duration-300">
                  {project.title}
                </h4>
                <p className="text-cyan-100/80 text-sm leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                
                {/* Technologies */}
                <div className="flex items-center gap-2 flex-wrap">
                  {project.technologies.map((tech, idx) => (
                    <TechPill key={idx} name={tech} />
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-2">
                  {project.liveLink && (
                    <a 
                      href={project.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 group/btn inline-flex items-center justify-center gap-2 px-4 py-3 accent-gradient text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Live
                    </a>
                  )}
                  {project.githubLink && (
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 group/btn inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-purple-500/40 text-purple-100 rounded-xl hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 font-semibold backdrop-blur-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Code
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
