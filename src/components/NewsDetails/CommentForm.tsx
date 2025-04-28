import React, { useState } from 'react';
import { FaImage, FaPaperPlane, FaTimes } from 'react-icons/fa';

interface CommentFormProps {
  onSubmit: () => void;
  value: string;
  onChange: (text: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  onRemoveImage: () => void;
  placeholder?: string;
  buttonText?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  value,
  onChange,
  onImageUpload,
  imagePreview,
  onRemoveImage,
  placeholder = "Add your comment...",
  buttonText = "Post",
}) => {
  const [previewExpanded, setPreviewExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md mb-3">
        <textarea
          rows={3}
          className="w-full bg-transparent p-4 text-gray-700 dark:text-gray-200 resize-none focus:outline-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>

        {imagePreview && (
          <div className="px-4 pb-2">
            <div className="relative inline-block">
              <div
                className={`relative rounded-lg overflow-hidden border-2 border-blue-400 ${
                  previewExpanded ? "w-full max-w-lg" : "w-32 h-32"
                }`}
              >
                <img
                  src={imagePreview}
                  alt="Comment attachment"
                  className={`${
                    previewExpanded ? "w-full" : "w-full h-full object-cover"
                  }`}
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500/80 transition-colors"
                  onClick={onRemoveImage}
                >
                  <FaTimes size={14} />
                </button>
              </div>
              <button
                type="button"
                className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-blue-500/80 transition-colors"
                onClick={() => setPreviewExpanded(!previewExpanded)}
              >
                {/* Expand/collapse icon */}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <label className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
              <FaImage className="text-xl" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageUpload}
              />
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!value.trim() && !imagePreview}
          >
            <span>{buttonText}</span>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
