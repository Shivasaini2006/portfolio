import React from 'react'

export default function HiringManager() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [applications, setApplications] = React.useState([])

  React.useEffect(() => {
    loadApplications()
  }, [])

  function loadApplications() {
    const savedApplications = localStorage.getItem('hiringApplications')
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications))
    }
  }

  const filteredApplications = applications.filter(app =>
    app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.position?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Hiring Applications</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or position..."
            className="w-full px-5 py-4 pl-12 border-2 border-purple-900/30 bg-black/40 text-cyan-50 rounded-xl focus:border-purple-500 focus:outline-none transition placeholder-cyan-100/50"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-100/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl border border-purple-900/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-cyan-100/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-cyan-100/70">
            {searchQuery ? 'No applications found matching your search.' : 'No hiring applications yet.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((app) => (
            <div key={app.id} className="glass p-6 rounded-xl border border-purple-900/20 hover:border-purple-700/30 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white font-bold">
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-cyan-50">{app.name}</h3>
                      <a href={`mailto:${app.email}`} className="text-sm text-green-400 hover:text-green-300">
                        {app.email}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-cyan-100/50">
                  {new Date(app.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-purple-900/30 border border-purple-700/30 text-purple-200 rounded-full text-sm font-medium">
                  {app.position}
                </span>
              </div>
              {app.resume && (
                <div className="mt-3">
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-green-900/30 text-green-50 rounded-lg hover:bg-green-900/20 transition text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    View Resume
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
