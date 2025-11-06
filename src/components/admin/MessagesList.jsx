import React from 'react'

export default function MessagesList() {
  const [messages, setMessages] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('adminToken')
      const headers = token ? { 'x-admin-token': token } : {}
      const res = await fetch('http://localhost:4000/api/messages', { headers })
      
      if (res.status === 401) {
        throw new Error('Session expired - please login again')
      }
      if (!res.ok) throw new Error('Failed to fetch messages')
      
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      setError(err.message)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
          <p className="mt-4 text-yellow-100/70">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-yellow-50">Contact Messages</h2>
        <button 
          onClick={loadMessages} 
          className="px-4 py-2 border border-yellow-900/30 rounded-xl hover:bg-yellow-900/20 text-yellow-50 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300">
          {error}
        </div>
      )}

      {messages && messages.length === 0 && (
        <div className="text-center py-12 glass rounded-xl border border-yellow-900/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-yellow-100/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-yellow-100/70">No messages yet.</p>
        </div>
      )}

      {messages && messages.length > 0 && (
        <div className="grid gap-4">
          {messages.map((m) => (
            <div key={m.id} className="glass p-6 rounded-xl border border-yellow-900/20 hover:border-yellow-700/30 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-black font-bold">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-50">{m.name}</h3>
                      <a href={`mailto:${m.email}`} className="text-sm text-yellow-400 hover:text-yellow-300">
                        {m.email}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-yellow-100/50">
                  {new Date(m.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="bg-black/20 rounded-lg p-4 border border-yellow-900/10">
                <p className="text-yellow-100/80 leading-relaxed">{m.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
