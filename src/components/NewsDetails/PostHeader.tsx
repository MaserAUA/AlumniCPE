import React from 'react';
import { FaTag, FaCalendarAlt, FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface PostHeaderProps {
  title: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  onBack: () => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  category,
  startDate,
  endDate,
  image,
  onBack,
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 pt-6 p-5">
        <button
          onClick={onBack}
          className="group flex items-center text-white bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700 transition-all duration-300 py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-x-1"
        >
          <FaChevronLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to News
        </button>
      </div>

      {image ? (
        <div className="relative h-72 md:h-96 overflow-hidden group">
          <img
            src={image ? image : "https://placehold.co/800x600?text=Image\nNot%20Found"}
            alt={title || "Main image"}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/800x600?text=Image\nNot%20Found";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-500 group-hover:translate-y-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight animate-fade-in-up">
              {title || "Untitled"}
            </h1>

            <div className="flex flex-wrap items-center mt-4 space-x-4 animate-fade-in-up delay-100">
              {category && (
                <span className="flex items-center text-sm text-blue-100 bg-blue-500/30 px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-blue-500/50 hover:scale-105">
                  <FaTag className="mr-1" />
                  {category}
                </span>
              )}

              {(startDate || endDate) && (
                <span className="flex items-center text-sm text-blue-100 bg-blue-500/30 px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-blue-500/50 hover:scale-105">
                  <FaCalendarAlt className="mr-1" />
                  {startDate && formatDate(startDate)}
                  {startDate && endDate && " - "}
                  {endDate && formatDate(endDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 ml-20 mt-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
            {title || "Untitled"}
          </h1>

          <div className="flex flex-wrap items-center space-x-4">
            {category && (
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105">
                <FaTag className="mr-1" />
                {category}
              </span>
            )}

            {(startDate || endDate) && (
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105">
                <FaCalendarAlt className="mr-1" />
                {startDate && formatDate(startDate)}
                {startDate && endDate && " - "}
                {endDate && formatDate(endDate)}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostHeader;
