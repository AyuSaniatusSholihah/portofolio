import React from 'react';
import { Github, Linkedin, Mail, Heart, Star, Award, Code, Users, ExternalLink, ChevronDown, User, BookOpen, PenTool, FileText, Edit, Crown, Calendar, MessageSquare, Clock, Lightbulb, Download } from 'lucide-react';

import { portfolioContent } from './data/portfolioContent.js';
import { usePortfolio } from './hooks/usePortfolio.js';

const Portfolio = () => {
  const { activeSection, expandedExp, isVisible, scrollToSection, setExpandedExp } = usePortfolio();
  const { aboutSkills, contactLinks, experiences, navSections, profilePhoto, projects, resumeLink, skillGroups, techIconMap } = portfolioContent;
  const researchIconMap = { BookOpen, PenTool, FileText, Edit };
  const softSkillIconMap = { Crown, Calendar, MessageSquare, FileText, Clock, Lightbulb };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-pink-100 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
              Ayu Saniatus Sholihah ✨
            </div>
            <div className="hidden md:flex space-x-8">
              {navSections.map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize font-medium transition-all duration-300 hover:text-pink-500 ${
                    activeSection === section ? 'text-pink-500' : 'text-gray-600'
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
      <section id="home" className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-center py-20">
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                  Hi, I'm <span className="bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">Nia!</span>
                </h1>
                <p className="text-xl text-gray-600 mb-2">Informatics Student</p>
                <p className="text-lg text-pink-500 font-medium mb-6">Universitas Sebelas Maret Surakarta</p>
                <div className="w-32 h-32 mx-auto mt-3 rounded-full bg-gradient-to-r from-pink-200 to-rose-200 flex items-center justify-center overflow-hidden shadow-lg">
                  <img 
                    src={profilePhoto} 
                    alt="Ayu Saniatus Sholihah"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100 max-w-3xl mx-auto mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Passionate about creating <span className="text-pink-500 font-semibold">innovative web solutions</span> that make a 
                  positive impact and developing tech solutions for <span className="text-pink-500 font-semibold">social good</span> 💕
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Get in Touch
                </button>
                <button className="border-2 border-pink-300 text-pink-600 px-8 py-3 rounded-full font-medium hover:bg-pink-50 transition-all duration-300">
                  <Github className="inline w-4 h-4 mr-2" />
                  View Work
                </button>
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="border-2 border-pink-300 text-pink-600 px-8 py-3 rounded-full font-medium hover:bg-pink-50 transition-all duration-300 inline-flex items-center"
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
      <section id="about" className="py-16 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            About <span className="text-pink-500">Me</span> 🌸
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Heart className="w-6 h-6 text-pink-500 mr-2" />
                About Me
              </h3>
              <p className="text-gray-600 leading-relaxed">
                I'm a 4th semester Informatics student at Universitas Sebelas Maret, passionate about 
                creating meaningful digital solutions. Through various projects and organizational experiences, 
                I've developed skills in web development, AI integration, and research writing. I combine 
                technical expertise with strong leadership and communication abilities to build innovative 
                solutions that address real-world challenges.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Code className="w-6 h-6 text-pink-500 mr-2" />
                Interdisciplinary Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {aboutSkills.map((tech) => (
                  <span key={tech} className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            My <span className="text-pink-500">Projects</span> 💝
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {project.category}
                    </span>
                    {project.status.includes("Winner") && (
                      <Award className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  <p className="text-pink-600 font-semibold text-sm">{project.status}</p>

                  <p className="mt-2 inline-block bg-pink-200 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
                    {project.type}
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, i) => {
                        const iconSlug = techIconMap[tech];
                        
                        return (
                          <div key={i} className="flex items-center gap-1 bg-pink-50 text-pink-600 px-2 py-1 rounded text-xs">
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
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Impact</h4>
                    <p className="text-xs text-gray-600">{project.impact}</p>
                  </div>
                  
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white py-2 rounded-lg font-medium hover:shadow-md transition-all duration-300 inline-flex items-center justify-center"
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
      <section id="experience" className="py-16 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            My <span className="text-pink-500">Experience</span> 🌟
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {experiences.map((exp, index) => (
              <div 
                key={index} 
                onClick={() => setExpandedExp(expandedExp === index ? null : index)}
                className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 active:scale-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      {exp.role}
                      <ChevronDown 
                        className={`w-5 h-5 text-pink-400 transition-transform duration-300 ${expandedExp === index ? 'rotate-180' : ''}`} 
                      />
                    </h3>
                    <p className="text-pink-500 font-semibold text-lg mb-1">{exp.organization}</p>
                    {exp.department && (
                      <p className="text-rose-400 font-medium mb-3">{exp.department}</p>
                    )}
                    {exp.start && exp.end && (
                      <p className="text-gray-500 text-sm mb-3">
                        {exp.start} - {exp.end}
                      </p>
                    )}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedExp === index ? 'max-h-96 opacity-100' : 'max-h-20 opacity-70'
                      }`}
                    >
                      <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                    </div>
                    {expandedExp !== index && (
                      <p className="text-pink-400 text-sm mt-2 font-medium">Click to read more...</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-pink-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Tools Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Skills & <span className="text-pink-500">Tools</span> 🛠️
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Code className="w-5 h-5 text-pink-500 mr-2" />
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
                      <span className="text-gray-700">{skill.name}</span>
                    </div>
                    <div className="w-20 h-2 bg-pink-100 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 text-pink-500 mr-2" />
                Research & Writing
              </h3>
              <div className="space-y-3">
                {skillGroups.research.map((skill) => {
                  const Icon = researchIconMap[skill.icon];

                  return (
                  <div key={skill.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-pink-400" />
                      <span className="text-gray-700">{skill.name}</span>
                    </div>
                    <div className="w-20 h-2 bg-pink-100 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full w-5/6"></div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 text-pink-500 mr-2" />
                Soft Skills
              </h3>
              <div className="space-y-3">
                {skillGroups.softSkills.map((skill) => {
                  const Icon = softSkillIconMap[skill.icon];

                  return (
                  <div key={skill.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-pink-400" />
                      <span className="text-gray-700">{skill.name}</span>
                    </div>
                    <div className="w-20 h-2 bg-pink-100 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full w-4/5"></div>
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
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">
            Let's <span className="text-pink-500">Connect</span> 💌
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            I'm always excited to discuss technology, collaborate on projects, or chat about innovation!
          </p>
          
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-8 shadow-lg border border-pink-100">
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={contactLinks.email}
                className="flex items-center space-x-2 bg-white text-pink-500 border-2 border-pink-500 px-6 py-3 rounded-full hover:bg-pink-50 active:scale-95 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                <span>Email Me</span>
              </a>
              <a 
                href={contactLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 bg-white text-pink-500 border-2 border-pink-500 px-6 py-3 rounded-full hover:bg-pink-50 active:scale-95 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a 
                href={contactLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 bg-white text-pink-500 border-2 border-pink-500 px-6 py-3 rounded-full hover:bg-pink-50 active:scale-95 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href={resumeLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 bg-white text-pink-500 border-2 border-pink-500 px-6 py-3 rounded-full hover:bg-pink-50 active:scale-95 transition-all duration-300"
              >
                <FileText className="w-5 h-5" />
                <span>My Resume</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-500 to-rose-400 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-lg font-medium mb-2">Ayu Saniatus Sholihah</p>
          <p className="text-pink-100">Informatika Student • Web Developer</p>
          <p className="text-pink-100 mt-4 text-sm">
            "Technology should empower, not replace" 💕
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button 
        onClick={() => scrollToSection('home')}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-pink-500 to-rose-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
      >
        <ChevronDown className="w-5 h-5 transform rotate-180" />
      </button>
    </div>
  );
};

export default Portfolio;