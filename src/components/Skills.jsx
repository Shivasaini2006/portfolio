import React from 'react';

export default function Skills() {
  const skillCategories = [
    {
      title: 'Frontend',
      icon: '🎨',
      color: 'purple',
      skills: [
        { name: 'React', level: 90, icon: '⚛️' },
        { name: 'JavaScript', level: 85, icon: '📜' },
        { name: 'Tailwind CSS', level: 95, icon: '🎨' },
        { name: 'HTML/CSS', level: 90, icon: '🌐' },
        { name: 'TypeScript', level: 75, icon: '📘' }
      ]
    },
    {
      title: 'Backend',
      icon: '⚙️',
      color: 'green',
      skills: [
        { name: 'Node.js', level: 85, icon: '🚀' },
        { name: 'Express', level: 80, icon: '🛤️' },
        { name: 'MongoDB', level: 75, icon: '🍃' },
        { name: 'REST APIs', level: 85, icon: '🔌' },
        { name: 'PostgreSQL', level: 70, icon: '🐘' }
      ]
    },
    {
      title: 'Tools & Others',
      icon: '🛠️',
      color: 'cyan',
      skills: [
        { name: 'Git/GitHub', level: 85, icon: '📦' },
        { name: 'Vite', level: 90, icon: '⚡' },
        { name: 'Webpack', level: 70, icon: '📦' },
        { name: 'Docker', level: 65, icon: '🐳' },
        { name: 'VS Code', level: 95, icon: '💻' }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold gold-gradient-text mb-4">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-purple-500 mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-cyan-100/70 max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <div
              key={idx}
              className="glass p-6 rounded-3xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${category.color}-500 to-${category.color}-600 flex items-center justify-center text-2xl`}>
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-cyan-50">{category.title}</h3>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-cyan-100/90 flex items-center gap-2">
                        <span>{skill.icon}</span>
                        {skill.name}
                      </span>
                      <span className="text-xs text-cyan-100/60">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-purple-900/20 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Tech Pills */}
        <div className="mt-12 text-center">
          <p className="text-sm text-cyan-100/60 mb-4">Also familiar with:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-200 font-medium">Redux</span>
            <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-200 font-medium">Next.js</span>
            <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-200 font-medium">GraphQL</span>
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-200 font-medium">Jest</span>
            <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-200 font-medium">Firebase</span>
            <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-200 font-medium">AWS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
