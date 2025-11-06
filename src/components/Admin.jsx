import React from 'react'

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [loginForm, setLoginForm] = React.useState({ email: '', password: '' })
  const [loginError, setLoginError] = React.useState(null)
  const [messages, setMessages] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [token, setToken] = React.useState(localStorage.getItem('adminToken') || '')
  const [adminEmail, setAdminEmail] = React.useState(localStorage.getItem('adminEmail') || '')

  // Check if already logged in on mount
  React.useEffect(() => {
    const savedToken = localStorage.getItem('adminToken')
    const savedEmail = localStorage.getItem('adminEmail')
    if (savedToken && savedEmail) {
      setToken(savedToken)
      setAdminEmail(savedEmail)
      setIsLoggedIn(true)
      loadMessages(savedToken)
    }
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError(null)
    try {
      const res = await fetch('http://localhost:4000/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Login failed')
      }
      const data = await res.json()
      setToken(data.token)
      setAdminEmail(data.email)
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminEmail', data.email)
      setIsLoggedIn(true)
      loadMessages(data.token)
    } catch (err) {
      setLoginError(err.message)
    }
  }

  async function loadMessages(authToken) {
    setError(null)
    try {
      const headers = authToken ? { 'x-admin-token': authToken } : {}
      const res = await fetch('http://localhost:4000/api/messages', { headers })
      if (res.status === 401) {
        // Token invalid, logout
        handleLogout()
        throw new Error('Session expired - please login again')
      }
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      setError(err.message)
      setMessages([])
    }
  }

  function handleLogout() {
    setIsLoggedIn(false)
    setToken('')
    setAdminEmail('')
    setMessages(null)
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
  }

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-xl max-w-md w-full border border-yellow-900/20">
          <h2 className="text-2xl font-semibold mb-6 text-center gold-gradient-text">Admin Login</h2>
          
          <form onSubmit={handleLogin} className="grid gap-4">
            <input 
              type="email" 
              placeholder="Email address" 
              value={loginForm.email}
              onChange={e => setLoginForm({...loginForm, email: e.target.value})}
              className="px-4 py-3 border-2 border-yellow-900/30 bg-black/40 text-yellow-50 rounded-xl focus:border-yellow-500 focus:outline-none transition placeholder-yellow-100/50" 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={loginForm.password}
              onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              className="px-4 py-3 border-2 border-yellow-900/30 bg-black/40 text-yellow-50 rounded-xl focus:border-yellow-500 focus:outline-none transition placeholder-yellow-100/50" 
              required 
            />
            <button type="submit" className="px-6 py-3 accent-gradient text-black rounded-xl hover:shadow-xl transition font-medium btn-gold-glow">
              Login
            </button>
          </form>

          {loginError && <div className="mt-4 text-red-300 text-sm text-center">{loginError}</div>}
          
          <div className="mt-6 text-center text-sm text-yellow-100/60">
            <p>Only authorized email can access this panel</p>
          </div>
        </div>
      </div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold gold-gradient-text">Admin — Messages</h2>
            <p className="text-sm text-yellow-100/70 mt-1">Logged in as: {adminEmail}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => loadMessages(token)} className="px-4 py-2 border border-yellow-900/30 rounded-xl hover:bg-yellow-900/20 text-yellow-50 transition">
              Refresh
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600/80 text-white rounded-xl hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>

        {error && <div className="mb-4 text-red-300">{error}</div>}

        {!messages && <div className="text-yellow-100/70">Loading messages...</div>}

        {messages && messages.length === 0 && <div className="text-yellow-100/70">No messages yet.</div>}

        {messages && messages.length > 0 && (
          <div className="grid gap-4">
            {messages.map(m => (
              <div key={m.id} className="glass p-4 rounded-xl border border-yellow-900/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-yellow-50">{m.name} — <span className="text-sm text-yellow-100/60">{m.email}</span></div>
                    <div className="text-sm text-yellow-100/50">{new Date(m.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <p className="mt-3 text-yellow-100/80">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
