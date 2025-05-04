import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaSearchPlus } from 'react-icons/fa';

interface ImageGalleryProps {
  images: string[];
  onImageClick: (image: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageClick }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setSelectedImage(images[(currentIndex + 1) % images.length]);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setSelectedImage(images[(currentIndex - 1 + images.length) % images.length]);
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-full mr-2">
          <FaSearchPlus className="text-lg" />
        </span>
        Gallery
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-lg shadow-md aspect-square cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onClick={() => handleImageClick(image, index)}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/400x400?text=Image Not Found";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                className="bg-white rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300 hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(image, index);
                }}
              >
                <FaSearchPlus className="text-blue-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors z-50 p-2 bg-black/30 rounded-full hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <FaTimes className="text-2xl" />
          </button>

          <button
            className="absolute left-4 text-white hover:text-blue-400 transition-colors z-50 p-2 bg-black/30 rounded-full hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
          >
            <FaChevronLeft className="text-2xl" />
          </button>

          <button
            className="absolute right-4 text-white hover:text-blue-400 transition-colors z-50 p-2 bg-black/30 rounded-full hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <FaChevronRight className="text-2xl" />
          </button>

          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain animate-fade-in"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/800x600?text=Image Not Found";
              }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
