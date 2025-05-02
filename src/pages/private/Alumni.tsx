import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Alumni/Card';
import Dashboard from '../../components/Alumni/Dashboard';
import Table from '../../components/Alumni/Table';
import Findmycpe from '../../components/Alumni/Findmycpe';
import { IoChatbubbleEllipses } from 'react-icons/io5';
function Alumni({ section }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (section) {
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn(`Section with id "${section}" not found.`);
        navigate('/');
      }
    }
  }, [section, navigate]);

  const handleChatClick = () => {
    navigate('/chatpage');
  };

  return (
    <div>
      <section id="table">
        <Table />
      </section>
      <section id="dashboard">
        <Dashboard />
      </section>
      <section id="findmycpe">
        <Findmycpe />
      </section>

      {/* เพิ่มปุ่มลอยแชท */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleChatClick}
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
          aria-label="Open chat"
        >
          <IoChatbubbleEllipses size={28} />
        </button>
      </div>
    </div>
  );
}

export default Alumni;
