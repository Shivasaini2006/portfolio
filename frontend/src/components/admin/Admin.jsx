import React from 'react'
import AdminDashboard from './AdminDashboard'

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [loginForm, setLoginForm] = React.useState({ email: '', password: '' })
  const [loginError, setLoginError] = React.useState(null)
  const [adminEmail, setAdminEmail] = React.useState(localStorage.getItem('adminEmail') || '')

  React.useEffect(() => {
    const savedToken = localStorage.getItem('adminToken')
    const savedEmail = localStorage.getItem('adminEmail')
    if (savedToken && savedEmail) {
      setAdminEmail(savedEmail)
      setIsLoggedIn(true)
    }
  }, [])

  const API_BASE = import.meta.env.VITE_API_BASE || ''

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError(null)
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Login failed')
      }
      const data = await res.json()
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminEmail', data.email)
      setAdminEmail(data.email)
      setIsLoggedIn(true)
      window.dispatchEvent(new Event('adminAuthChanged'))
    } catch (err) {
      setLoginError(err.message)
    }
  }

  function handleLogout() {
    setIsLoggedIn(false)
    setAdminEmail('')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    window.dispatchEvent(new Event('adminAuthChanged'))
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-xl max-w-md w-full border border-yellow-900/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold gold-gradient-text">Admin Login</h2>
            <p className="text-sm text-yellow-100/60 mt-2">Secure access to your dashboard</p>
          </div>
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
              Login to Dashboard
            </button>
          </form>
          {loginError && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
              {loginError}
            </div>
          )}
          <div className="mt-6 text-center text-xs text-yellow-100/50">
            <p>🔒 Only authorized email can access this panel</p>
          </div>
        </div>
      </div>
    )
  }

  return <AdminDashboard adminEmail={adminEmail} onLogout={handleLogout} />
}
