import React, { useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  <div className="flex items-start">
    <Icon className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-gray-700 text-sm">{value}</p>
    </div>
  </div>
);

const ContactRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div className="flex items-center">
    <Icon className="text-blue-500 mr-3 flex-shrink-0" size={18} />
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-gray-700 text-sm sm:text-base truncate max-w-[300px]">{value}</p>
    </div>
  </div>
);

const Card = ({ data = {}, onClose }: { data: any, onClose: () => void }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const mergedData: TableRow = useMemo(() => ({ ...defaultData, ...data }), [data]);

  const handleChatClick = () => {
    const { first_name, last_name, email, profile_picture } = mergedData;
    navigate("/chatpage", { state: { contact: { first_name, last_name, email, avatar: profile_picture || "https://via.placeholder.com/100" } } });
  };

  const initials = useMemo(() =>
    `${mergedData.first_name[0]}${mergedData.first_name[1]}`.toUpperCase(), [mergedData.first_name]
  );

  const badgeClass = courseColors[courseLabelMap[mergedData.student_type]] || courseColors.default;

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 bg-white/30 hover:bg-white/50 text-gray-600 rounded-full p-2 transition duration-200 z-10 close-button"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose size={20} />
        </button>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 pt-8 pb-14 px-6 relative">
          <div className="absolute left-0 right-0 bottom-0 h-16 bg-white rounded-t-3xl" />
        </div>

        <div className="flex justify-center -mt-12 relative z-10 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            {mergedData.profile_picture ? (
              <img
                src={mergedData.profile_picture}
                alt={`${mergedData.first_name} ${mergedData.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{initials}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {mergedData.first_name} {mergedData.last_name}
          </h2>
          { courseLabelMap[mergedData.student_type] &&
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm border ${badgeClass}`}>
                {courseLabelMap[mergedData.student_type]}
              </span>
            </div>
          }
          { mergedData.position && mergedData.company &&
            <div className="mt-3 text-gray-600 flex items-center justify-center">
              <IoBriefcaseOutline className="mr-2" />
              <span>{mergedData.position} at {mergedData.company}</span>
            </div>
          }
        </div>

        <div className="px-6 py-5">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {mergedData.email && <ContactRow icon={IoMailOutline} label="Email" value={mergedData.email} />}
            {mergedData.phone && <ContactRow icon={IoCallOutline} label="Phone" value={mergedData.phone} />}
          </div>

          <h3 className="text-sm font-medium text-gray-500 mb-3">Academic & Professional</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {mergedData.student_id && <InfoRow icon={IoSchoolOutline} label="Student ID" value={mergedData.student_id} />}
            {mergedData.company && <InfoRow icon={IoBriefcaseOutline} label="Working At" value={mergedData.company} />}
            {mergedData.position &&<InfoRow icon={IoDocumentTextOutline} label="Line of Work" value={mergedData.position} />}
            {mergedData.generation &&<InfoRow icon={IoCardOutline} label="CPE" value={mergedData.generation} />}
          </div>
        </div>

        <div className="grid grid-cols-1 border-t border-gray-100">
          <button
            onClick={handleChatClick}
            className="py-4 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-blue-600 font-medium transition-colors"
          >
            <IoChatbubbleEllipsesOutline size={18} />
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
