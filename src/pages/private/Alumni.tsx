import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Alumni/Table';
import WordCloudChart from '../../components/admin/Dashboard/WordCloudChart';
import Select from 'react-select'
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { FaUsers, FaChartPie, FaGraduationCap } from 'react-icons/fa';
import GenerationLineChart from '../../components/Alumni/GenerationLineChart';

// import Card from '../../components/Alumni/Card';
// import Findmycpe from '../../components/Alumni/Findmycpe';

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

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '45px',
      borderRadius: '0.75rem',
      borderColor: '#e2e8f0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#f8fafc',
      '&:hover': {
        borderColor: '#3b82f6',
        boxShadow: '0 4px 6px rgba(59, 130, 246, 0.1)'
      },
      '&:focus-within': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e0f2fe' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
      padding: '12px 16px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected ? '#2563eb' : '#e0f2fe'
      }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      maxHeight: '300px',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0'
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '300px',
      padding: '8px'
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#e0f2fe',
      borderRadius: '0.5rem',
      padding: '2px'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#1e40af',
      fontWeight: '500',
      padding: '2px 6px'
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#1e40af',
      borderRadius: '0.25rem',
      '&:hover': {
        backgroundColor: '#bfdbfe',
        color: '#1e40af'
      }
    }),
    placeholder: (base) => ({
      ...base,
      color: '#64748b',
      fontWeight: '500'
    })
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 p-6 pb-48'>
      <section id="table" className="mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <FaUsers className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Contacts </h2>
          </div>
          <Table />
        </div>
      </section>

      <section id="distribution" className="mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <FaChartPie className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Alumni Position Distribution</h2>
          </div>
          <WordCloudChart/>
        </div>
      </section>

      <section id="dashboard" className="mb-24">
        <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <FaGraduationCap className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Alumni Student Type</h2>
          </div>
          <div className="mb-6">
            <Select
              isMulti
              options={generationOptions}
              onChange={(selected) => setSelectedCPEs(selected.map(option => option.value))}
              styles={customSelectStyles}
              className="text-gray-700"
              placeholder="Select CPE Generations..."
              classNamePrefix="select"
              isSearchable={true}
              menuPlacement="auto"
              noOptionsMessage={() => "No generations found"}
              loadingMessage={() => "Loading..."}
            />
          </div>
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
