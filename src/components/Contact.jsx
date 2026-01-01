import React from 'react'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' })
  const [status, setStatus] = React.useState(null)

  const API_BASE = import.meta.env.VITE_API_BASE || ''

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      // Send email via EmailJS
      const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
        await emailjs.send(
          emailjsServiceId,
          emailjsTemplateId,
          {
            from_name: form.name,
            from_email: form.email,
            message: form.message,
            to_name: 'Shiva Saini',
          },
          emailjsPublicKey
        )
      }

      // Save to database
      const res = await fetch(`${API_BASE}/api/messages`, {
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
    <section id="contact" className="py-20">
      <div className="max-w-3xl mx-auto">
        <div className="glass rounded-3xl p-10 md:p-14 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 backdrop-blur-xl">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300 font-medium mb-4">
              📬 Let's Connect
            </div>
            <h3 className="text-4xl md:text-5xl font-black gold-gradient-text">
              Get in Touch
            </h3>
            <p className="text-lg text-cyan-100/80 max-w-xl mx-auto">Have a project in mind? Let's work together to bring your ideas to life.</p>
          </div>

          <form onSubmit={submit} className="grid gap-6">
            <div className="relative group">
              <input 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full px-6 py-4 border-2 border-purple-500/30 bg-black/50 text-cyan-50 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all placeholder-cyan-100/40 font-medium backdrop-blur-sm" 
                placeholder="Your name" 
                required 
              />
            </div>
            <div className="relative group">
              <input 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                className="w-full px-6 py-4 border-2 border-purple-500/30 bg-black/50 text-cyan-50 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all placeholder-cyan-100/40 font-medium backdrop-blur-sm" 
                placeholder="Your email" 
                type="email" 
                required 
              />
            </div>
            <div className="relative group">
              <textarea 
                value={form.message} 
                onChange={e => setForm({...form, message: e.target.value})} 
                className="w-full px-6 py-4 border-2 border-purple-500/30 bg-black/50 text-cyan-50 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all placeholder-cyan-100/40 font-medium backdrop-blur-sm resize-none" 
                rows="6" 
                placeholder="Your message..." 
                required 
              />
            </div>
            <div className="text-center mt-4">
              <button 
                type="submit" 
                disabled={status === 'sending'}
                className="w-full md:w-auto px-10 py-5 accent-gradient text-white rounded-xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold text-lg"
              >
                {status === 'sending' ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Send Message</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          {status === 'sent' && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50 rounded-2xl text-green-300 text-center fade-in-up backdrop-blur-sm">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-semibold text-lg">Message sent successfully!</p>
              <p className="text-sm text-green-200/80 mt-1">I'll get back to you as soon as possible.</p>
            </div>
          )}
          {status === 'error' && (
            <div className="mt-8 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-400/50 rounded-2xl text-red-300 text-center fade-in-up backdrop-blur-sm">
              <div className="text-4xl mb-2">❌</div>
              <p className="font-semibold text-lg">Oops! Something went wrong</p>
              <p className="text-sm text-red-200/80 mt-1">Please try again or email me directly.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
