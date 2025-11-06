import React from 'react'
import MessagesList from './MessagesList'
import ProjectsManager from './ProjectsManager'

export default function AdminDashboard({ adminEmail, onLogout }) {
  const [activeTab, setActiveTab] = React.useState('messages')

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <div className="glass border-b border-yellow-900/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gold-gradient-text">Admin Dashboard</h1>
              <p className="text-sm text-yellow-100/70 mt-1">Logged in as: {adminEmail}</p>
            </div>
            <button 
              onClick={onLogout} 
              className="px-4 py-2 bg-red-600/80 text-white rounded-xl hover:bg-red-600 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass border-b border-yellow-900/20">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 font-medium transition relative ${
                activeTab === 'messages'
                  ? 'text-yellow-400'
                  : 'text-yellow-100/60 hover:text-yellow-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Messages
              </div>
              {activeTab === 'messages' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 font-medium transition relative ${
                activeTab === 'projects'
                  ? 'text-yellow-400'
                  : 'text-yellow-100/60 hover:text-yellow-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Projects
              </div>
              {activeTab === 'projects' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'messages' && <MessagesList />}
        {activeTab === 'projects' && <ProjectsManager />}
      </div>
    </div>
  )
}
