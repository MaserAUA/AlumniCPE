import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Dashboard from './Dashboard';
import Table from './Table';
import Findmycpe from './Findmycpe';
import { IoChatbubbleEllipses } from 'react-icons/io5'; // เพิ่ม import ไอคอน

function Alumni({ section }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (section) {
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn(`Section with id "${section}" not found.`);
        navigate('/'); // เปลี่ยนเส้นทางกลับหน้าแรกหากหา section ไม่เจอ
      }
    }
  }, [section, navigate]);

  // เพิ่มฟังก์ชันสำหรับการนำทางไปยังหน้า ChatPage
  const handleChatClick = () => {
    navigate('/chatpage');
  };

  return (
    <div>
      <section id="dashboard">
        <Dashboard />
      </section>
      <section id="table">
        <Table />
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