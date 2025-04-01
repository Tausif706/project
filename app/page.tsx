'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronRightIcon, 
  PlayCircleIcon, 
  LightBulbIcon, 
  ChatBubbleLeftRightIcon, 
  RocketLaunchIcon,
  XMarkIcon,
  Bars3Icon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Replace the placeholder image URLs with actual placeholder service
const placeholderService = 'https://placehold.co';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [stats, setStats] = useState({ users: 0, ideas: 0, teams: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate stats counting up
  useEffect(() => {
    const interval = setInterval(() => {
      if (stats.users < 10000) {
        setStats(prev => ({
          users: Math.min(prev.users + 123, 10000),
          ideas: Math.min(prev.ideas + 57, 5000),
          teams: Math.min(prev.teams + 23, 2000)
        }));
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Pitch Your Idea",
      description: "Share your vision with our community and get instant feedback from industry experts who can help refine your concept.",
      icon: LightBulbIcon,
      color: "bg-gradient-to-br from-amber-50 to-amber-100 border-l-4 border-amber-400",
      iconColor: "text-amber-500"
    },
    {
      title: "Smart Collaboration",
      description: "Our AI-powered platform extracts actionable tasks from conversations and matches you with the perfect team members.",
      icon: ChatBubbleLeftRightIcon,
      color: "bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-400",
      iconColor: "text-blue-500"
    },
    {
      title: "Launch & Grow",
      description: "Track progress, build your reputation with our star system, and turn your idea into a successful venture.",
      icon: RocketLaunchIcon,
      color: "bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-400",
      iconColor: "text-green-500"
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Founder, EcoTech Solutions",
      image: `${placeholderService}/80/80`,
      content: "IdeaCraft connected me with the perfect technical team for my sustainability app. The AI task extraction feature saved us weeks of planning!",
      stars: 5
    },
    {
      name: "Miguel Rodriguez",
      role: "Senior Developer",
      image: `${placeholderService}/80/80`,
      content: "As a collaborator, the star system has significantly boosted my visibility. I've worked on three successful startups through this platform.",
      stars: 5
    },
    {
      name: "Dr. Aisha Patel",
      role: "Tech Mentor & Investor",
      image: `${placeholderService}/80/80`,
      content: "The quality of ideas on IdeaCraft is impressive. I've mentored several startups that have gone on to secure significant funding.",
      stars: 4
    },
  ];

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar with scroll effect */}
      <nav className={`fixed w-full z-10 transition-all duration-300 ${
        scrollPosition > 50 ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <a href="#" className="flex-shrink-0 flex items-center">
                <span className={`text-2xl font-bold transition-colors ${
                  scrollPosition > 50 || isMenuOpen ? "text-blue-600" : "text-white"
                }`}>
                  IdeaCraft
                </span>
              </a>
              <div className="hidden md:flex md:ml-10 md:space-x-8">
                <a href="#how-it-works" className={`transition-colors ${
                  scrollPosition > 50 ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"
                }`}>How It Works</a>
                <a href="#for-pitchers" className={`transition-colors ${
                  scrollPosition > 50 ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"
                }`}>For Pitchers</a>
                <a href="#for-collaborators" className={`transition-colors ${
                  scrollPosition > 50 ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"
                }`}>For Collaborators</a>
                <a href="#resources" className={`transition-colors ${
                  scrollPosition > 50 ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"
                }`}>Resources</a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="/login" className={`transition-colors ${
                scrollPosition > 50 ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"
              }`}>Sign In</a>
              <a href="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                Get Started
              </a>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${
                  scrollPosition > 50 ? "text-gray-700" : "text-white"
                }`}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">How It Works</a>
              <a href="#for-pitchers" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">For Pitchers</a>
              <a href="#for-collaborators" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">For Collaborators</a>
              <a href="#resources" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">Resources</a>
              <div className="border-t border-gray-200 my-2"></div>
              <a href="/login" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">Sign In</a>
              <a href="/signup" className="block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Get Started</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with animated background */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080')] bg-cover bg-center mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        </div>
        <div className="relative pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 animate-fadeIn">
                Turn Ideas <span className="text-blue-300">into</span> Reality
              </h1>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto animate-fadeIn animation-delay-300">
                Connect with experts, collaborators, and innovators to build your dream project in our AI-powered collaboration platform
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fadeIn animation-delay-500">
                <a href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl">
                  Start Your Journey
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </a>
                <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center text-white border border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#f9fafb">
            <path d="M0,96L60,80C120,64,240,32,360,32C480,32,600,64,720,80C840,96,960,96,1080,80C1200,64,1320,32,1380,16L1440,0L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <UserGroupIcon className="h-10 w-10 text-blue-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.users.toLocaleString()}+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <LightBulbIcon className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.ideas.toLocaleString()}+</div>
              <div className="text-gray-600">Ideas Pitched</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <RocketLaunchIcon className="h-10 w-10 text-green-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900">{stats.teams.toLocaleString()}+</div>
              <div className="text-gray-600">Teams Formed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Build Your Team in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform streamlines the journey from idea to execution with powerful tools and an engaged community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`${feature.color} p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <feature.icon className={`h-12 w-12 ${feature.iconColor} mb-6`} />
                <h3 className={`text-xl ${feature.iconColor} font-semibold mb-4`}>{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section */} 
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch our demo to see how IdeaCraft connects ideas with talent
            </p>
          </div>
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl relative">
            {isVideoPlaying ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-xl">Video is playing...</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center relative group cursor-pointer" onClick={handleVideoPlay}>
                <img src="https://placehold.co/1280x720" alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity"></div>
                <div className="relative z-10 transform transition-transform group-hover:scale-110">
                  <PlayCircleIcon className="h-20 w-20 text-white" />
                </div>
              </div>
            )}
            
            {/* Bottom line with dividers */}
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center">
              <div className="w-full max-w-4xl mx-auto px-8 flex items-center">
                <div className="h-1 bg-white bg-opacity-70 flex-grow"></div>
                <div className="h-6 w-1 bg-white bg-opacity-70 mx-4"></div>
                <div className="h-1 bg-white bg-opacity-70 flex-grow"></div>
                <div className="h-6 w-1 bg-white bg-opacity-70 mx-4"></div>
                <div className="h-1 bg-white bg-opacity-70 flex-grow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-20 text-gray-600 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our community of innovators and collaborators
            </p>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <div className="flex items-center mb-6">
                        <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4" />
                        <div>
                          <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                          <p className="text-gray-600">{testimonial.role}</p>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i} 
                                className={`h-5 w-5 ${i < testimonial.stars ? 'text-yellow-400' : 'text-gray-300'}`} 
                                fill={i < testimonial.stars ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"{ testimonial.content }"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    activeTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Types Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Who's IdeaCraft For?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform brings together different talents to create successful projects
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div id="for-pitchers" className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-md border-t-4 border-blue-500">
              <LightBulbIcon className="h-12 w-12 text-blue-500 mb-6" />
              <h3 className="text-xl text-blue-500 font-semibold mb-4">Idea Pitchers</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Entrepreneurs with innovative ideas</span>
                </li>
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Startups looking to build their team</span>
                </li>
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Companies seeking fresh perspectives</span>
                </li>
              </ul>
              <a href="/for-pitchers" className="inline-block mt-6 text-blue-600 font-semibold hover:text-blue-800">
                Learn More →
              </a>
            </div>
            
            <div id="for-collaborators" className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-md border-t-4 border-amber-400">
              <UserGroupIcon className="h-12 w-12 text-amber-400 mb-6" />
              <h3 className="text-xl text-amber-400 font-semibold mb-4">Collaborators</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Developers, designers, and creators</span>
                </li>
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Professionals seeking side projects</span>
                </li>
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Skill-builders looking for experience</span>
                </li>
              </ul>
              <a href="/for-collaborators" className="inline-block mt-6 text-amber-400 font-semibold hover:text-amber-600">
                Learn More →
              </a>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-md border-t-4 border-green-500">
              <StarIcon className="h-12 w-12 text-green-500 mb-6" />
              <h3 className="text-xl text-green-500 font-semibold mb-4">Professionals & Guides</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Industry experts and mentors</span>
                </li>
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Investors looking for opportunities</span>
                </li>
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advisors who want to share knowledge</span>
                </li>
              </ul>
              <a href="/for-professionals" className="inline-block mt-6 text-green-600 font-semibold hover:text-green-800">
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="resources" className="py-20 bg-gray-50 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">How much does IdeaCraft cost?</h3>
              <p className="text-gray-700">Your first project is completely free. For subsequent projects, we offer flexible pricing plans starting at $19/month.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">How does the star rating system work?</h3>
              <p className="text-gray-700">Pitchers award stars to collaborators based on contribution quality. Higher star ratings increase visibility and opportunities.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Can I work on multiple projects?</h3>
              <p className="text-gray-700">To ensure quality, users can only actively participate in one project at a time. Once completed, you can join another project.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">How does the AI feature work?</h3>
              <p className="text-gray-700">Our AI analyzes chat conversations to identify key tasks and required skills, helping pitchers build the right team for their project.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Bring Your Idea to Life?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join over 10,000 innovators already building the future on IdeaCraft
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl">
              Start Free Today
            </a>
            <a href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center text-white border border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
              Contact Sales
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            
            {/* Brand Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">IdeaCraft</h3>
              <p className="text-gray-400">Empowering innovators worldwide since 2024</p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452H16.89v-5.484c0-1.307-.026-2.992-1.822-2.992-1.824 0-2.104 1.423-2.104 2.895v5.58h-3.556V9h3.415v1.561h.047c.477-.901 1.635-1.851 3.366-1.851 3.602 0 4.267 2.368 4.267 5.451v6.291zM5.337 7.433a2.067 2.067 0 01-2.062-2.072c0-1.14.923-2.067 2.063-2.067 1.14 0 2.067.927 2.067 2.067s-.927 2.072-2.067 2.072zM7.128 20.452H3.551V9h3.577v11.452z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12.073C22 6.49 17.523 2 12 2S2 6.49 2 12.073c0 5.029 3.657 9.209 8.432 9.895v-7.009H7.898v-2.886h2.534V9.414c0-2.503 1.492-3.887 3.774-3.887 1.096 0 2.238.195 2.238.195v2.494h-1.26c-1.244 0-1.63.777-1.63 1.571v1.883h2.773l-.444 2.886h-2.329v7.009C18.344 21.282 22 17.102 22 12.073z"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Testimonials</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter to get the latest updates and news.</p>
              <form className="flex space-x-2">
                <input type="email" placeholder="Your email" className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">Subscribe</button>
              </form>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} IdeaCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}