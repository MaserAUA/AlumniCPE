import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Alumni/Table';
import WordCloudChart from '../../components/admin/Dashboard/WordCloudChart';
import Select from 'react-select'

// import Card from '../../components/Alumni/Card';
// import Findmycpe from '../../components/Alumni/Findmycpe';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import GenerationLineChart from '../../components/Alumni/GenerationLineChart';
function Alumni({ section }) {
  const navigate = useNavigate();
  const [selectedCPEs, setSelectedCPEs] = useState<string[]>([]);
  const handleCPEChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value);
    setSelectedCPEs(selectedOptions);
  }, []);

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

  const generationOptions = Array.from({ length: new Date().getFullYear() - 1987 }, (_, i) => ({
    value: `CPE${i + 1}`,
    label: `CPE${i + 1}`,
  }));

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
      <section id="dashboard">
        <div className="bg-white rounded-lg shadow-sm p-6 m-4">
          <Select
            isMulti
            options={generationOptions}
            onChange={(selected) => setSelectedCPEs(selected.map(option => option.value))}
            className="mb-4 text-blue-700 rounded-lg font-semibold w-1/3"
            placeholder="Select CPE Generations..."
          />
          <h3 className="text-lg font-semibold text-slate-800 mb-6 mr-4">Alumni Student Type</h3>
          <GenerationLineChart
            cpe={selectedCPEs}
          />
        </div>
      </section>
      {
      // <section id="findmycpe">
      //   <Findmycpe />
      // </section>
      }
    </div>
  );
}

export default Alumni;
