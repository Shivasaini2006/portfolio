import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold gold-gradient-text mb-4">
              About Me
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* About Content */}
          <div className="glass p-8 md:p-12 rounded-3xl border border-purple-500/20">
            <div className="space-y-6">
              <p className="text-lg text-cyan-100/90 leading-relaxed">
                Hi, I'm <span className="font-semibold gold-gradient-text">Shiva Saini</span>, a dedicated Full Stack Developer 
                and final-year BCA student with hands-on experience in building modern, responsive, and user-centric web solutions.
              </p>
              
              <p className="text-lg text-cyan-100/90 leading-relaxed">
                I specialize in <span className="text-purple-300 font-semibold">React</span>, <span className="text-green-300 font-semibold">Node.js</span>, 
                <span className="text-green-300 font-semibold"> MongoDB</span>, and <span className="text-cyan-300 font-semibold">Tailwind CSS</span>, 
                and I enjoy creating efficient applications that solve real-world problems.
              </p>

              <p className="text-lg text-cyan-100/90 leading-relaxed">
                With over a year of practical experience, I'm constantly improving my backend development skills and exploring 
                the world of AI/ML to build smarter, more scalable systems. I love learning, experimenting, and turning ideas 
                into working products.
              </p>

              {/* Quick Stats */}
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
