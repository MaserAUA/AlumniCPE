import React, { useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import html2canvas from "html2canvas";
import {
  IoClose, IoMailOutline, IoCallOutline, IoSchoolOutline,
  IoBookOutline, IoBriefcaseOutline, IoLocationOutline,
  IoCardOutline, IoWalletOutline, IoDocumentTextOutline,
  IoChatbubbleEllipsesOutline, IoDownloadOutline
} from "react-icons/io5";
import { courseLabelMap } from "./Table"

interface TableRow {
  profile_picture: string,
  first_name: string,
  last_name: string,
  generation: string,
  student_id: string,
  department: string,
  faculty: string,
  field: string,
  student_type: string,
  email: string,
  phone: string,
  company: string,
  position: string,
}

const defaultData: TableRow = {
  profile_picture: "",
  first_name: "",
  last_name: "",
  student_id: "",
  generation: "",
  department: "",
  faculty: "",
  field: "",
  student_type: "",
  position: "",
  company: "",
  email: "",
  phone: "",
};

const courseColors: Record<string, string> = {
  Regular: "bg-green-100 text-green-600 border-green-200",
  INTER: "bg-blue-100 text-blue-600 border-blue-200",
  HDS: "bg-purple-100 text-purple-600 border-purple-200",
  RC: "bg-orange-100 text-orange-600 border-orange-200",
  default: "bg-gray-100 text-gray-600 border-gray-200",
};

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div 
    className="flex items-start p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-blue-100 hover:shadow-md group"
    data-aos="fade-up"
    data-aos-delay="100"
  >
    <Icon className="text-blue-500 mr-3 mt-0.5 flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300" size={18} />
    <div>
      <p className="text-xs text-gray-400 font-medium group-hover:text-blue-500 transition-colors duration-300">{label}</p>
      <p className="text-gray-700 text-sm font-medium group-hover:text-blue-600 transition-colors duration-300">{value}</p>
    </div>
  </div>
);

const ContactRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div 
    className="flex items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-blue-100 hover:shadow-md group"
    data-aos="fade-up"
    data-aos-delay="150"
  >
    <Icon className="text-blue-500 mr-3 flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300" size={20} />
    <div>
      <p className="text-xs text-gray-400 font-medium group-hover:text-blue-500 transition-colors duration-300">{label}</p>
      <p className="text-gray-700 text-sm sm:text-base truncate max-w-[300px] font-medium group-hover:text-blue-600 transition-colors duration-300">{value}</p>
    </div>
  </div>
);

const Card = ({ data = {}, onClose }: { data: any, onClose: () => void }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const mergedData: TableRow = useMemo(() => ({ ...defaultData, ...data }), [data]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  const handleChatClick = () => {
    const { first_name, last_name, email, profile_picture } = mergedData;
    navigate("/chatpage", { state: { contact: { first_name, last_name, email, avatar: profile_picture || "https://via.placeholder.com/100" } } });
  };

  const initials = useMemo(() =>
    `${mergedData.first_name[0]}${mergedData.first_name[1]}`.toUpperCase(), [mergedData.first_name]
  );

  const badgeClass = courseColors[courseLabelMap[mergedData.student_type]] || courseColors.default;

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/70 backdrop-blur-md z-50" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all duration-500 hover:scale-[1.02]"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        data-aos="zoom-in"
      >
        <button
          className="absolute top-4 right-4 bg-white/30 hover:bg-white/50 text-gray-600 rounded-full p-2 transition-all duration-300 z-10 close-button hover:rotate-90 hover:scale-110"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose size={20} />
        </button>

        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 pt-10 pb-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwLTIuMjA5IDEuNzkxLTQgNC00czQgMS43OTEgNCA0LTEuNzkxIDQtNCA0LTQtMS43OTEtNC00eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
          <div className="absolute left-0 right-0 bottom-0 h-20 bg-white rounded-t-3xl" />
        </div>

        <div className="flex justify-center -mt-14 relative z-10 mb-6">
          <div 
            className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            {mergedData.profile_picture ? (
              <img
                src={mergedData.profile_picture}
                alt={`${mergedData.first_name} ${mergedData.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">{initials}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center px-6" data-aos="fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {mergedData.first_name} {mergedData.last_name}
          </h2>
          { courseLabelMap[mergedData.student_type] &&
            <div className="mt-2">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm border ${badgeClass} shadow-md hover:shadow-lg transition-shadow duration-300`}>
                {courseLabelMap[mergedData.student_type]}
              </span>
            </div>
          }
          { mergedData.position && mergedData.company &&
            <div className="mt-4 text-gray-600 flex items-center justify-center">
              <IoBriefcaseOutline className="mr-2 text-blue-500" />
              <span className="font-medium">{mergedData.position} at {mergedData.company}</span>
            </div>
          }
        </div>

        <div className="px-6 py-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Contact Information</h3>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {mergedData.email && <ContactRow icon={IoMailOutline} label="Email" value={mergedData.email} />}
            {mergedData.phone && <ContactRow icon={IoCallOutline} label="Phone" value={mergedData.phone} />}
          </div>

          <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Academic & Professional</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mergedData.student_id && <InfoRow icon={IoSchoolOutline} label="Student ID" value={mergedData.student_id} />}
            {mergedData.company && <InfoRow icon={IoBriefcaseOutline} label="Working At" value={mergedData.company} />}
            {mergedData.position &&<InfoRow icon={IoDocumentTextOutline} label="Line of Work" value={mergedData.position} />}
            {mergedData.generation &&<InfoRow icon={IoCardOutline} label="CPE" value={mergedData.generation} />}
          </div>
        </div>

        <div className="grid grid-cols-1 border-t border-gray-100">
          <button
            onClick={handleChatClick}
            className="py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-white text-blue-600 font-medium transition-all duration-300 group"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <IoChatbubbleEllipsesOutline size={20} className="transform group-hover:scale-110 transition-transform duration-300" />
            <span className="group-hover:translate-x-1 transition-transform duration-300">Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
