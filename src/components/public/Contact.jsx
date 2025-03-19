import React, { useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUniversity } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Contact() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
    });
  }, []);

  const contactInfo = [
    {
      icon: FaPhoneAlt,
      label: "Phone",
      value: "(+66) 0 2470 9388",
    },
    {
      icon: FaEnvelope,
      label: "Email",
      value: "nongyao.jam@mail.kmutt.ac.th",
    },
    {
      icon: FaUniversity,
      label: "Department",
      value: "School of Computer Engineering",
    },
  ];

  // Function to handle Get Directions button click
  const handleGetDirections = () => {
    window.open("https://maps.app.goo.gl/9xSrhAck7BRovxz37", "_blank");
  };

  return (
    <div className="bg-blue-500 min-h-screen">
      {/* Outer container with rounded corners */}
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Main content card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
          {/* Map Section - Wide and with correct aspect ratio */}
          <div className="w-full h-72 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.019879625987!2d100.49501021532125!3d13.651255902319777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e298dbcd1f97a7%3A0x6f9d4f73aeff1a04!2sSchool%20of%20Computer%20Engineering%2C%20KMUTT!5e0!3m2!1sen!2sth!4v1699612345678!5m2!1sen!2sth"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="KMUTT CPE Map"
            />
          </div>

          {/* Contact Information Section */}
          <div className="p-6">
            {/* Contact Information Heading with underline */}
            <div className="mb-6" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-blue-500 mb-1">
                Contact Information
              </h2>
              <div className="h-1 w-24 bg-blue-500 rounded-full mb-6"></div>
            </div>

            {/* Main Office Info with rounded icon */}
            <div 
              className="bg-gray-50 rounded-xl p-4 mb-6"
              data-aos="fade-up"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500 text-white shrink-0 mt-1">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Main Office</h3>
                  <p className="text-gray-600">
                    Floor 10-11, Wisavawattana Building, King Mongkut's University of Technology Thonburi
                    <br />
                    126 Pracha Uthit Road, Bang Mot Subdistrict,
                    <br />
                    Thung Khru District, Bangkok 10140
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Details in a clean list format */}
            <div className="space-y-4" data-aos="fade-up">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <div className="p-3 rounded-xl bg-blue-500 text-white shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-500">{item.label}</p>
                    <p className="text-gray-900 font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Get Directions Button */}
            <div className="mt-8" data-aos="fade-up">
              <button 
                onClick={handleGetDirections}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-4 px-6 font-medium transition duration-300 flex items-center justify-center"
              >
                Get Directions
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;