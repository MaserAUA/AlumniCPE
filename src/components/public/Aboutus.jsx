import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ChevronRight, BookOpen, Users, Lightbulb, GraduationCap } from 'lucide-react';

function Aboutus() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
    });
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Academic Excellence",
      description: "World-class education with innovative curriculum"
    },
    {
      icon: Users,
      title: "Alumni Network",
      description: "Connecting graduates for lifelong collaboration and growth"
    },
    {
      icon: GraduationCap,
      title: "Legacy Building",
      description: "Creating meaningful relationships that last beyond graduation"
    },
    {
      icon: Lightbulb,
      title: "Innovation Hub",
      description: "Platform for alumni to share ideas and opportunities"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-12">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Logo Section with improved rotation animation */}
          <div className="w-full lg:w-1/3" data-aos="fade-right">
            <div className="relative group max-w-sm mx-auto">
              {/* Outer glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-blue-400 to-orange-400 rounded-full opacity-20 group-hover:opacity-30 blur-xl transition-all duration-700" />
              
              {/* Inner shadow ring */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-orange-400 rounded-full opacity-30 group-hover:opacity-40 transition-all duration-700" />
              
              {/* Main logo container with improved rotation animation */}
              <div className="relative flex items-center justify-center w-48 h-48 rounded-full overflow-hidden bg-white shadow-2xl">
                {/* Inner gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-orange-50 opacity-50" />
                
                {/* Additional circle mask to ensure perfect roundness */}
                <div className="absolute inset-0 rounded-full bg-white overflow-hidden" />
                
                {/* Logo image with enhanced rotation and movement effects */}
                <div className="relative w-4/5 h-4/5 transform transition-all duration-700 ease-in-out 
                  group-hover:rotate-180 origin-center overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-white rounded-full" />
                  
                  <img
                    src="/LogoCPE.png"
                    alt="KMUTT CPE"
                    className="w-full h-full object-contain transition-transform duration-700 relative z-10"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-r from-blue-500/0 to-orange-500/0 
                    group-hover:from-blue-500/10 group-hover:to-orange-500/10 
                    transition-all duration-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 lg:pr-8">
            {/* Title */}
            <h1 
              className="text-4xl lg:text-5xl font-bold leading-tight mb-4"
              data-aos="fade-up"
            >
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Building Lifelong
              </span>
              <br />
              <span className="text-gray-900">Alumni Connections</span>
            </h1>

            {/* Description - Updated to focus on alumni relationships */}
            <p 
              className="text-lg text-gray-600 leading-relaxed mb-8"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Our community extends far beyond graduation. We create a vibrant ecosystem where alumni can connect, collaborate, and grow together. Through regular events, mentorship programs, and networking opportunities, we foster meaningful relationships that last a lifetime. Our alumni network is a powerful resource for professional development, knowledge sharing, and creating new opportunities together.
            </p>

            {/* Features Grid - Updated to 2x2 grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <feature.icon className="w-6 h-6 text-blue-500 mb-2" />
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;