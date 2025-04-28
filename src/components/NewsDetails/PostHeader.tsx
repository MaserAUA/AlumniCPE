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
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={onBack}
          className="flex items-center text-white bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700 transition-colors py-2 px-4 rounded-lg shadow-md"
        >
          <FaChevronLeft className="mr-2" />
          Back to News
        </button>
      </div>

      {image ? (
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img
            src={image  ? image : "https://placehold.co/800x600?text=Image\nNot%20Found"}
            alt={title || "Main image"}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/800x600?text=Image\nNot%20Found";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {title || "Untitled"}
            </h1>

            <div className="flex flex-wrap items-center mt-4 space-x-4">
              {category && (
                <span className="flex items-center text-sm text-blue-100 bg-blue-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  <FaTag className="mr-1" />
                  {category}
                </span>
              )}

              {(startDate || endDate) && (
                <span className="flex items-center text-sm text-blue-100 bg-blue-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
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
        <div className="mb-8 ml-20 mt-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {title || "Untitled"}
          </h1>

          <div className="flex flex-wrap items-center space-x-4">
            {category && (
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                <FaTag className="mr-1" />
                {category}
              </span>
            )}

            {(startDate || endDate) && (
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
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
