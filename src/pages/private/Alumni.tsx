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

  return (
    <div>
      <section id="table">
        <Table />
      </section>
      {
      // <section id="dashboard">
      //   <Dashboard />
      // </section>
      // <section id="findmycpe">
      //   <Findmycpe />
      // </section>
      }
    </div>
  );
}

export default Alumni;
