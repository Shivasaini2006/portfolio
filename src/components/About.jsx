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
                Hi! I'm <span className="font-semibold gold-gradient-text">Shiva Saini</span>, a passionate Full-Stack Developer 
                with a keen eye for creating beautiful, performant, and user-friendly web applications.
              </p>
              
              <p className="text-lg text-cyan-100/90 leading-relaxed">
                I specialize in building modern web experiences using cutting-edge technologies like React, Node.js, 
                and Tailwind CSS. My approach combines clean code, intuitive design, and scalable architecture to 
                deliver solutions that not only meet requirements but exceed expectations.
              </p>

              <p className="text-lg text-cyan-100/90 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
                or sharing knowledge with the developer community. I believe in continuous learning and staying updated 
                with the latest trends in web development.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
                <div className="text-center p-4 bg-purple-900/20 rounded-xl border border-purple-500/20">
                  <div className="text-3xl font-bold gold-gradient-text mb-2">2+</div>
                  <div className="text-sm text-purple-100/70">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-green-900/20 rounded-xl border border-green-500/20">
                  <div className="text-3xl font-bold gold-gradient-text mb-2">15+</div>
                  <div className="text-sm text-green-100/70">Projects Completed</div>
                </div>
                <div className="text-center p-4 bg-cyan-900/20 rounded-xl border border-cyan-500/20 col-span-2 md:col-span-1">
                  <div className="text-3xl font-bold gold-gradient-text mb-2">100%</div>
                  <div className="text-sm text-cyan-100/70">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
