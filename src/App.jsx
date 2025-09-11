import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Heart, Star, Award, Code, Users, ExternalLink, ChevronDown, User } from 'lucide-react';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const projects = [
    {
      title: "Hijaiyahku",
      description: "Platform digital pembelajaran membaca huruf hijaiyah interaktif untuk disabilitas rungu",
      tech: ["figma"],
      category: "web design",
      status: "In Development",
      type: "Team Project",
      impact: "Supporting SDGs Goal 4: Quality Education"
    },
    {
      title: "FarmIntel",
      description: "Platform digital berbasis AI untuk diagnosis penyakit tanaman cabai dan dukungan komunitas petani",
      tech: ["figma"],
      category: "app design",
      status: "In Development",
      type: "Team Project",
      impact: "Supporting SDGs Goal 2: Zero Hunger"
    },
    {
      title: "E-Shrimp",
      description: "Platform digitalisasi penjualan udang dan olahan untuk UMKM pesisir",
      tech: ["html", "css", "javascript", "digital marketing"],
      category: "Business Solution",
      status: "In Essay Competition, In Development",
      type: "Team Project (Competition)",
      impact: "Supporting coastal communities and local SMEs"
    },
    {
      title: "FriendYours",
      description: "Platform digital ruang curhat anonim berbasis chatbot dan dukungan komunitas",
      tech: ["React", "AI Chatbot", "Community Features"],
      category: "Frontend",
      status: "In Development",
      type: "Team Project",
      impact: "Supporting SDGs Goal 3: Good Health and Well-being"
    },
    {
      title: "Web Math",
      description: "Media pembelajaran berbasis audiobook Braille dan QR-Integrated Web",
      tech: ["QR Code Integration", "Audio Technology", "Fuzzy Machine", "React & Vite"],
      category: "Educational Technology",
      status: "In Essay Competition and In Development",
      type: "Team Project (Competition)",
      impact: "Inclusive education for students with hearing impairments"

    },
    {
      title: "Wifi Dashboard",
      description: "Platform digitalisasi manajemen jaringan wifi untuk Pondok Pesantren Mahasiswa Miftahul Khoirot",
      tech: ["Network Management", "Dashboard UI", "Data Visualization"],
      category: "project",
      status: "In Development",
      type: "project personal",
      impact: "Streamlining wifi management and monitoring"
    }
  ];

  const experiences = [
    {
      role: "Staff Member",
      organization: "SIM UNS (Sekolah Ilmiah Mahasiswa)",
      department: "Kompetisi dan Prestasi",
      description: "Supporting student competition participation and achievement tracking, assisting in organizing training and workshops"
    },
    {
      role: "Secretary",
      organization: "SKILL PAB (Open Recruitment Event)",
      department: "SIM UNS",
      description: "Handling administrative processes for new student recruitment event, managing documentation and coordination"
    },
    {
      role: "Vice Secretary Division",
      organization: "AKSI (Agenda Kegiatan Studi Banding)",
      department: "SIM UNS with FST UNDIP",
      description: "Assisting in secretariat duties for inter-university study event, coordinating schedules helping to find venues"
    },
    {
      role: "Head of Secretary Division",
      organization: "PKS (Pekan Keluarga SIM)",
      department: "SIM UNS Event",
      description: "Leading secretariat operations for major SIM family week event, coordinating documentation and administrative processes"
    },
    
    
    {
      role: "WiFi InfrastructuSupportinre Manager",
      organization: "Pondok Pesantren Mahasiswa Miftahul Khoirot",
      description: "Managing technical infrastructure and financial records using Google Spreadsheet and web dashboard for systematic tracking"
    },
    {
      role: "Facilities and Infrastructure Division",
      organization: "Pondok Pesantren Mahasiswa Miftahul Khoirot",
      description: "Oversee facility management and infrastructure development projects and summarize everything in a google spreadsheet."
    },
    {
      role: "Student Council Member",
      organization: "Dewan Ambalan",
      department: "Scouting Organization (High School)",
      description: "Active in scouting leadership development, organizing community service and character building programs"
    },
    {
      role: "Research Club Member",
      organization: "KIR (Karya Ilmiah Remaja)",
      department: "High School Extracurricular",
      description: "Developing research and scientific writing skills, participating in student research competitions and academic writing contests"
    },
   
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

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
              {['home', 'about', 'projects', 'experience'].map((section) => (
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
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-pink-200 to-rose-200 flex items-center justify-center text-6xl mb-6 shadow-lg">
                  🐱
                </div>
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                  Hi, I'm <span className="bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">Nia!</span>
                </h1>
                <p className="text-xl text-gray-600 mb-2">Informatics Student | Web Developer | AI enthusiast</p>
                <p className="text-lg text-pink-500 font-medium">Universitas Sebelas Maret Surakarta</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-100 max-w-3xl mx-auto mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Passionate about creating <span className="text-pink-500 font-semibold">innovative web solutions</span> that make a 
                  positive impact and developing tech solutions for <span className="text-pink-500 font-semibold">social good</span> 💕
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <button className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Get in Touch
                </button>
                <button className="border-2 border-pink-300 text-pink-600 px-8 py-3 rounded-full font-medium hover:bg-pink-50 transition-all duration-300">
                  <Github className="inline w-4 h-4 mr-2" />
                  View Work
                </button>
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
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Heart className="w-6 h-6 text-pink-500 mr-2" />
                  My Vision
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  I believe technology should empower people, not replace them. My mission is to create 
                  inclusive digital solutions that bridge gaps and make a positive impact on society, 
                  especially for underserved communities.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Code className="w-6 h-6 text-pink-500 mr-2" />
                  Interdisciplinary Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Web Development', 'AI Integration', 'Research Writing', 'Academic Essays', 'Competition Entries', 'Scientific Documentation'].map((tech) => (
                    <span key={tech} className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">What Drives Me</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Creating solutions for real-world problems</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Supporting local communities through technology</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Making education more accessible and inclusive</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Promoting sustainable development through innovation</p>
                </div>
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

    {/* Tambahan: type ditampilkan dengan badge */}
    <p className="mt-2 inline-block bg-pink-200 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
      {project.type}
    </p>
  </div>
  
  <div className="p-6">
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Technologies</h4>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech, i) => (
          <span key={i} className="bg-pink-50 text-pink-600 px-2 py-1 rounded text-xs">
            {tech}
          </span>
        ))}
      </div>
    </div>
    
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-1">Impact</h4>
      <p className="text-xs text-gray-600">{project.impact}</p>
    </div>
    
    <button className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white py-2 rounded-lg font-medium hover:shadow-md transition-all duration-300">
      <ExternalLink className="inline w-4 h-4 mr-1" />
      Learn More
    </button>
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
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{exp.role}</h3>
                    <p className="text-pink-500 font-semibold text-lg mb-1">{exp.organization}</p>
                    {exp.department && (
                      <p className="text-rose-400 font-medium mb-3">{exp.department}</p>
                    )}
                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
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
                {['HTML, CSS, JS', 'React & Vite Framework', 'UI/UX Design', 'Database Management'].map((skill) => (
                  <div key={skill} className="flex items-center justify-between">
                    <span className="text-gray-700">{skill}</span>
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
                {['Academic Research', 'Essay Writing', 'Scientific Writing', 'Content Creation'].map((skill) => (
                  <div key={skill} className="flex items-center justify-between">
                    <span className="text-gray-700">{skill}</span>
                    <div className="w-20 h-2 bg-pink-100 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 text-pink-500 mr-2" />
                Soft Skills
              </h3>
              <div className="space-y-3">
                {['Team Management', 'Project Coordination', 'Communication', 'Time Management'].map((skill) => (
                  <div key={skill} className="flex items-center justify-between">
                    <span className="text-gray-700">{skill}</span>
                    <div className="w-20 h-2 bg-pink-100 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goals & Vision */}
      <section className="py-16 bg-gradient-to-r from-pink-100 to-rose-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Future <span className="text-pink-500">Goals</span> 🎯
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Short-term Goals</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <Star className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                  <span>Continue competing in technology competitions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                  <span>Develop more socially impactful web projects</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                  <span>Join impactful internship programs in software development</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Long-term Vision</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <Star className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                  <span>Continue and further develop the application previously created</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                  <span>Collaborate with broader and higher-level stakeholders</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Star className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                  <span>Return to the local community to deliver innovation and serve the people</span>
                </li>
              </ul>
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
            <div className="flex justify-center space-x-6">
              <button className="flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-all duration-300 hover:shadow-lg">
                <Mail className="w-5 h-5" />
                <span>Email Me</span>
              </button>
              <button className="flex items-center space-x-2 bg-white text-pink-500 border-2 border-pink-500 px-6 py-3 rounded-full hover:bg-pink-50 transition-all duration-300">
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </button>
              <button className="flex items-center space-x-2 bg-white text-pink-500 border-2 border-pink-500 px-6 py-3 rounded-full hover:bg-pink-50 transition-all duration-300">
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-500 to-rose-400 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-lg font-medium mb-2">Ayu Saniatus Sholihah</p>
          <p className="text-pink-100">Informatika Student • Web Developer • Innovation Enthusiast • AI Enthusiast</p>
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