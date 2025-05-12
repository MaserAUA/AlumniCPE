import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Alumni/Table';
import WordCloudChart from '../../components/admin/Dashboard/WordCloudChart';

// import Card from '../../components/Alumni/Card';
// import Dashboard from '../../components/Alumni/Dashboard';
// import Findmycpe from '../../components/Alumni/Findmycpe';
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
    <div className='bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 '>
      <section id="table">
        <Table />
      </section>
      <section id="distribution">
        <div className="bg-white rounded-lg shadow-sm p-6 m-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 mr-4">Alumni Position Distribution</h3>
          <WordCloudChart/>
        </div>
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
