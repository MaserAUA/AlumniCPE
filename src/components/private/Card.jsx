import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { IoClose, IoMailOutline, IoCallOutline, IoSchoolOutline, 
         IoBookOutline, IoBriefcaseOutline, IoLocationOutline, 
         IoCardOutline, IoWalletOutline, IoGlobeOutline, 
         IoDocumentTextOutline, IoChatbubbleEllipsesOutline, 
         IoDownloadOutline } from "react-icons/io5";

const Card = ({ data = {}, onClose }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // Navigate to ChatPage with contact data
  const handleChatClick = () => {
    const contact = {
      firstName: data.firstName || "Unknown",
      lastName: data.lastName || "Unknown",
      email: data.email || "noemail@example.com",
      avatar: data.avatar || "https://via.placeholder.com/100",
    };
    navigate("/chatpage", { state: { contact } });
  };

  // Download card as image
  const downloadCardAsImage = () => {
    if (cardRef.current) {
      // Add a class to hide the close button during capture
      cardRef.current.classList.add('capturing');
      
      html2canvas(cardRef.current).then((canvas) => {
        // Remove the class after capture
        cardRef.current.classList.remove('capturing');
        
        const link = document.createElement("a");
        link.download = `${data.firstName || 'profile'}-card.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  // Generate initials for avatar
  const getInitials = () => {
    const first = (data.firstName || "").charAt(0);
    const last = (data.lastName || "").charAt(0);
    return (first + last).toUpperCase();
  };

  // Get course badge color
  const getCourseColor = (course) => {
    switch(course) {
      case "Regular": return "bg-green-100 text-green-600 border-green-200";
      case "INTER": return "bg-blue-100 text-blue-600 border-blue-200";
      case "HDS": return "bg-purple-100 text-purple-600 border-purple-200";
      case "RC": return "bg-orange-100 text-orange-600 border-orange-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - will be hidden during image capture with CSS */}
        <button
          className="absolute top-3 right-3 bg-white/30 hover:bg-white/50 text-gray-600 rounded-full p-2 transition duration-200 z-10 close-button"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose size={20} />
        </button>

        {/* Profile header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 pt-8 pb-14 px-6 relative">
          <div className="absolute left-0 right-0 bottom-0 h-16 bg-white rounded-t-3xl"></div>
        </div>

        {/* Profile image - positioned to overlap header and content */}
        <div className="flex justify-center -mt-12 relative z-10 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            {data.avatar ? (
              <img
                src={data.avatar}
                alt={`${data.firstName} ${data.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{getInitials()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Name and basic info */}
        <div className="text-center px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {data.firstName || "John"} {data.lastName || "Doe"}
          </h2>
          
          <div className="flex items-center justify-center mt-1 text-gray-500">
            <IoLocationOutline className="mr-1" />
            <span>{data.nation || "USA"}</span>
          </div>
          
          <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm border ${getCourseColor(data.course)}`}>
              {data.course || "Regular"}
            </span>
          </div>
          
          <div className="mt-3 text-gray-600 flex items-center justify-center">
            <IoBriefcaseOutline className="mr-2" />
            <span>{data.jobPosition || "Software Engineer"} at {data.workingCompany || "Google"}</span>
          </div>
        </div>

        {/* Information sections */}
        <div className="px-6 py-5">
          {/* Contact Information */}
          <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="flex items-center">
              <IoMailOutline className="text-blue-500 mr-3 flex-shrink-0" size={18} />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-gray-700 text-sm sm:text-base truncate max-w-[300px]">{data.email || "john.doe@example.com"}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <IoCallOutline className="text-blue-500 mr-3 flex-shrink-0" size={18} />
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-gray-700 text-sm sm:text-base">{data.phoneNumber || "123-456-7890"}</p>
              </div>
            </div>
          </div>

          {/* Academic & Professional */}
          <h3 className="text-sm font-medium text-gray-500 mb-3">Academic & Professional</h3>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <div className="flex items-start">
              <IoSchoolOutline className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs text-gray-400">Student ID</p>
                <p className="text-gray-700 text-sm">{data.studentID || "64070501001"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <IoBookOutline className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs text-gray-400">Favorite Subject</p>
                <p className="text-gray-700 text-sm">{data.favoriteSubject || "Math"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <IoBriefcaseOutline className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs text-gray-400">Working At</p>
                <p className="text-gray-700 text-sm">{data.workingCompany || "Google"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <IoDocumentTextOutline className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs text-gray-400">Line of Work</p>
                <p className="text-gray-700 text-sm">{data.lineOfWork || "IT"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <IoCardOutline className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs text-gray-400">CPE Model</p>
                <p className="text-gray-700 text-sm">{data.cpeModel || "CPE 35"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <IoWalletOutline className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs text-gray-400">Salary</p>
                <p className="text-gray-700 text-sm">{data.salary || "100,000"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 border-t border-gray-100">
          <button
            onClick={handleChatClick}
            className="py-4 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-blue-600 font-medium transition-colors"
          >
            <IoChatbubbleEllipsesOutline size={18} />
            <span>Message</span>
          </button>
          
          <button
            onClick={downloadCardAsImage}
            className="py-4 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-600 font-medium transition-colors border-l border-gray-100"
          >
            <IoDownloadOutline size={18} />
            <span>Save Card</span>
          </button>
        </div>
        
        {/* Style to hide close button during capture */}
        <style jsx>{`
          .capturing .close-button {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Card;