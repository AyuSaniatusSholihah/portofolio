import React from 'react';
import { Github, Linkedin, Mail, Heart, Star, Award, Code, Users, ExternalLink, ChevronDown, User, BookOpen, PenTool, FileText, Edit, Crown, Calendar, MessageSquare, Clock, Lightbulb, Download } from 'lucide-react';

import './App.css';
import { portfolioContent } from './data/portfolioContent.js';
import { usePortfolio } from './hooks/usePortfolio.js';
import { useScrollReveal } from './hooks/useScrollReveal.js';

const Portfolio = () => {
  const { activeSection, expandedExp, isVisible, scrollToSection, setExpandedExp } = usePortfolio();
  const { aboutSkills, contactLinks, experiences, navSections, profilePhoto, projects, resumeLink, skillGroups, techIconMap } = portfolioContent;
  const researchIconMap = { BookOpen, PenTool, FileText, Edit };
  const softSkillIconMap = { Crown, Calendar, MessageSquare, FileText, Clock, Lightbulb };

  useScrollReveal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800 z-50 transition-all duration-300 shadow-lg shadow-slate-950/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Ayu Saniatus Sholihah ✨
            </div>
            <div className="hidden md:flex space-x-8">
              {navSections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`nav-link-button capitalize font-medium ${
                    activeSection === section ? 'text-sky-400' : 'text-slate-300'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16" data-reveal>
        <div className="max-w-6xl mx-auto px-6">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-center py-20">
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-slate-900 mb-4">
                  Hi, I'm <span className="bg-gradient-to-r from-sky-500 to-blue-700 bg-clip-text text-transparent">Nia!</span>
                </h1>
                <p className="text-xl text-slate-600 mb-2">Informatics Student</p>
                <p className="text-lg text-sky-700 font-medium mb-6">Universitas Sebelas Maret Surakarta</p>
                <div className="w-32 h-32 mx-auto mt-3 rounded-full bg-gradient-to-r from-sky-200 to-blue-300 flex items-center justify-center overflow-hidden shadow-lg shadow-sky-900/10 ring-4 ring-white">
                  <img 
                    src={profilePhoto} 
                    alt="Ayu Saniatus Sholihah"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200 max-w-3xl mx-auto mb-8" data-reveal style={{ '--reveal-delay': '120ms' }}>
                <p className="text-slate-700 leading-relaxed text-lg">
                  Passionate about creating <span className="text-sky-700 font-semibold">innovative web solutions</span> that make a 
                  positive impact and developing tech solutions for <span className="text-sky-700 font-semibold">social good</span>.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={contactLinks.email}
                  target="_blank"
                  rel="noreferrer"
                  className="action-button inline-flex items-center bg-gradient-to-r from-sky-600 to-blue-800 text-white px-8 py-3 rounded-full font-medium hover:shadow-xl hover:shadow-sky-900/20 transform hover:-translate-y-1 active:scale-95"
                >
                  <Mail className="inline w-4 h-4 mr-2" />
                  Get in Touch
                </a>
                <a
                  href="#projects"
                  className="action-button inline-flex items-center border-2 border-sky-300 text-sky-700 px-8 py-3 rounded-full font-medium hover:bg-sky-50 hover:shadow-md active:scale-95"
                >
                  <Github className="inline w-4 h-4 mr-2" />
                  View Work
                </a>
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="action-button border-2 border-sky-300 text-sky-700 px-8 py-3 rounded-full font-medium hover:bg-sky-50 hover:shadow-md inline-flex items-center active:scale-95"
                >
                  <Download className="inline w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-slate-950/5" data-reveal>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">
            About <span className="text-sky-700">Me</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div className="card-press bg-white rounded-2xl p-6 shadow-lg border border-slate-200" data-reveal style={{ '--reveal-delay': '90ms' }}>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center">
                <Heart className="w-6 h-6 text-sky-700 mr-2" />
                About Me
              </h3>
              <p className="text-slate-600 leading-relaxed">
                I'm a 4th semester Informatics student at Universitas Sebelas Maret, passionate about 
                creating meaningful digital solutions. Through various projects and organizational experiences, 
                I've developed skills in web development, AI integration, and research writing. I combine 
                technical expertise with strong leadership and communication abilities to build innovative 
                solutions that address real-world challenges.
              </p>
            </div>
            
            <div className="card-press bg-white rounded-2xl p-6 shadow-lg border border-slate-200" data-reveal style={{ '--reveal-delay': '180ms' }}>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center">
                <Code className="w-6 h-6 text-sky-700 mr-2" />
                Interdisciplinary Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {aboutSkills.map((tech) => (
                  <span key={tech} className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium border border-sky-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16" data-reveal>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">
            My <span className="text-sky-700">Projects</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="card-press bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl" data-reveal style={{ '--reveal-delay': `${index * 90}ms` }}>
                <div className="bg-gradient-to-r from-slate-900 to-sky-900 p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-white/15 text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                      {project.category}
                    </span>
                    {project.status.includes("Winner") && (
                      <Award className="w-5 h-5 text-amber-300" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-slate-100/90 text-sm mb-3">{project.description}</p>
                  <p className="text-sky-200 font-semibold text-sm">{project.status}</p>

                  <p className="mt-2 inline-block bg-white/10 text-sky-100 px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                    {project.type}
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => {
                        const iconSlug = techIconMap[tech];
                        
                        return (
                          <div key={i} className="flex items-center gap-1 bg-sky-50 text-sky-700 px-2 py-1 rounded text-xs border border-sky-100">
                            {iconSlug && (
                              <img 
                                src={`https://go-skill-icons.vercel.app/api/icons?i=${iconSlug}&theme=light`}
                                alt={tech}
                                className="w-4 h-4"
                              />
                            )}
                            <span>{tech}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">Impact</h4>
                    <p className="text-xs text-slate-600">{project.impact}</p>
                  </div>
                  
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="action-button w-full bg-gradient-to-r from-sky-600 to-blue-800 text-white py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-sky-900/20 inline-flex items-center justify-center active:scale-95"
                  >
                    <ExternalLink className="inline w-4 h-4 mr-1" />
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 bg-slate-950/5" data-reveal>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">
            My <span className="text-sky-700">Experience</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {experiences.map((exp, index) => (
              <div 
                key={index} 
                onClick={() => setExpandedExp(expandedExp === index ? null : index)}
                className="card-press bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl cursor-pointer transform hover:scale-[1.02] active:scale-100"
                data-reveal
                style={{ '--reveal-delay': `${index * 90}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                      {exp.role}
                      <ChevronDown 
                        className={`w-5 h-5 text-sky-500 transition-transform duration-300 ${expandedExp === index ? 'rotate-180' : ''}`} 
                      />
                    </h3>
                    <p className="text-sky-700 font-semibold text-lg mb-1">{exp.organization}</p>
                    {exp.department && (
                      <p className="text-slate-500 font-medium mb-3">{exp.department}</p>
                    )}
                    {exp.start && exp.end && (
                      <p className="text-slate-500 text-sm mb-3">
                        {exp.start} - {exp.end}
                      </p>
                    )}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedExp === index ? 'max-h-96 opacity-100' : 'max-h-20 opacity-70'
                      }`}
                    >
                      <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                    </div>
                    {expandedExp !== index && (
                      <p className="text-sky-500 text-sm mt-2 font-medium">Click to read more...</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-sky-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Tools Section */}
      <section className="py-16" data-reveal>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">
            Skills & <span className="text-sky-700">Tools</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-press bg-white rounded-2xl p-6 shadow-lg border border-slate-200" data-reveal style={{ '--reveal-delay': '90ms' }}>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Code className="w-5 h-5 text-sky-700 mr-2" />
                Development
              </h3>
              <div className="space-y-3">
                {skillGroups.development.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={`https://go-skill-icons.vercel.app/api/icons?i=${skill.icons}&theme=light`}
                        alt={skill.name}
                        className="w-6 h-6"
                      />
                      <span className="text-slate-700">{skill.name}</span>
                    </div>
                    <div className="w-20 h-2 bg-slate-200 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-sky-500 to-blue-700 rounded-full w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-press bg-white rounded-2xl p-6 shadow-lg border border-slate-200" data-reveal style={{ '--reveal-delay': '180ms' }}>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 text-sky-700 mr-2" />
                Research & Writing
              </h3>
              <div className="space-y-3">
                {skillGroups.research.map((skill) => {
                  const Icon = researchIconMap[skill.icon];

                  return (
                  <div key={skill.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-sky-500" />
                      <span className="text-slate-700">{skill.name}</span>
                    </div>
                    <div className="w-20 h-2 bg-slate-200 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-sky-500 to-blue-700 rounded-full w-5/6"></div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            <div className="card-press bg-white rounded-2xl p-6 shadow-lg border border-slate-200" data-reveal style={{ '--reveal-delay': '270ms' }}>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Users className="w-5 h-5 text-sky-700 mr-2" />
                Soft Skills
              </h3>
              <div className="space-y-3">
                {skillGroups.softSkills.map((skill) => {
                  const Icon = softSkillIconMap[skill.icon];

                  return (
                  <div key={skill.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-sky-500" />
                      <span className="text-slate-700">{skill.name}</span>
                    </div>
                    <div className="w-20 h-2 bg-slate-200 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-sky-500 to-blue-700 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white" data-reveal>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 text-slate-900">
            Let's <span className="text-sky-700">Connect</span>
          </h2>
          
          <p className="text-xl text-slate-600 mb-8">
            I'm always excited to discuss technology, collaborate on projects, or chat about innovation!
          </p>
          
          <div className="bg-gradient-to-r from-slate-950 to-slate-800 rounded-2xl p-8 shadow-lg border border-slate-800" data-reveal style={{ '--reveal-delay': '120ms' }}>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={contactLinks.email}
                className="action-button flex items-center space-x-2 bg-white text-sky-700 border-2 border-sky-500 px-6 py-3 rounded-full hover:bg-sky-50 active:scale-95"
              >
                <Mail className="w-5 h-5" />
                <span>Email Me</span>
              </a>
              <a 
                href={contactLinks.github}
                target="_blank"
                rel="noreferrer"
                className="action-button flex items-center space-x-2 bg-white text-sky-700 border-2 border-sky-500 px-6 py-3 rounded-full hover:bg-sky-50 active:scale-95"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a 
                href={contactLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="action-button flex items-center space-x-2 bg-white text-sky-700 border-2 border-sky-500 px-6 py-3 rounded-full hover:bg-sky-50 active:scale-95"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href={resumeLink}
                target="_blank"
                rel="noreferrer"
                className="action-button flex items-center space-x-2 bg-white text-sky-700 border-2 border-sky-500 px-6 py-3 rounded-full hover:bg-sky-50 active:scale-95"
              >
                <FileText className="w-5 h-5" />
                <span>My Resume</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-950 to-sky-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-lg font-medium mb-2">Ayu Saniatus Sholihah</p>
          <p className="text-sky-100">Informatika Student • Web Developer</p>
          <p className="text-sky-100 mt-4 text-sm">
            "Technology should empower, not replace" 💕
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button 
        onClick={() => scrollToSection('home')}
        className="floating-action fixed bottom-8 right-8 bg-gradient-to-r from-sky-600 to-blue-800 text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:shadow-sky-900/20 transform hover:-translate-y-1"
      >
        <ChevronDown className="w-5 h-5 transform rotate-180" />
      </button>
    </div>
  );
};

export default Portfolio;