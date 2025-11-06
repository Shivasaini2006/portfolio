import React from 'react'

export default function Contact() {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' })
  const [status, setStatus] = React.useState(null)

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('http://localhost:4000/api/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      console.error(err)
    }
  }

  return (
    <section id="contact" className="py-16">
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-3xl p-8 md:p-12 border border-purple-900/20">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-3 gold-gradient-text">
              Get in Touch
            </h3>
            <p className="text-cyan-100/80">I'm open to new opportunities and freelance work. Send me a message and I'll get back to you.</p>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <input 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              className="px-5 py-4 border-2 border-purple-900/30 bg-black/40 text-cyan-50 rounded-xl focus:border-purple-500 focus:outline-none transition placeholder-cyan-100/50" 
              placeholder="Your name" 
              required 
            />
            <input 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              className="px-5 py-4 border-2 border-purple-900/30 bg-black/40 text-cyan-50 rounded-xl focus:border-purple-500 focus:outline-none transition placeholder-cyan-100/50" 
              placeholder="Your email" 
              type="email" 
              required 
            />
            <textarea 
              value={form.message} 
              onChange={e => setForm({...form, message: e.target.value})} 
              className="px-5 py-4 border-2 border-purple-900/30 bg-black/40 text-cyan-50 rounded-xl focus:border-purple-500 focus:outline-none transition placeholder-cyan-100/50" 
              rows="5" 
              placeholder="Your message" 
              required 
            />
            <div className="text-center mt-2">
              <button 
                type="submit" 
                disabled={status === 'sending'}
                className="px-8 py-4 accent-gradient text-white rounded-xl shadow-lg hover:shadow-xl hover-scale transition disabled:opacity-50 disabled:cursor-not-allowed font-medium btn-gold-glow"
              >
                {status === 'sending' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message'}
              </button>
            </div>
          </form>

          {status === 'sent' && (
            <div className="mt-6 p-4 bg-green-900/30 border-2 border-green-500/50 rounded-xl text-green-300 text-center fade-in-up">
              ✅ Thanks — your message has been sent successfully!
            </div>
          )}
          {status === 'error' && (
            <div className="mt-6 p-4 bg-red-900/30 border-2 border-red-500/50 rounded-xl text-red-300 text-center fade-in-up">
              ❌ Something went wrong — please try again later.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
