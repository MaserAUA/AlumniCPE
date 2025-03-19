import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Dashboard from './Dashboard';
import Table from './Table'; 
import Findmycpe from './Findmycpe';

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
    </div>
  );
}

export default Alumni;
