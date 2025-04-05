import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaTimes, FaCalendarAlt, FaTag, FaUsers, FaLink, FaImage, FaSmile, FaSave } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { useUpdatePost } from "../../api/post";

const Editpostmodal = ({ post, onClose, onSave }) => {
  // State for form data
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");
  const [emoji, setEmoji] = useState(post.emoji || "");
  const [images, setImages] = useState(post.images || []);
  const [startDate, setStartDate] = useState(
    post.startDate ? parseDate(post.startDate) : null
  );
  const [endDate, setEndDate] = useState(
    post.endDate ? parseDate(post.endDate) : null
  );
  const [category, setCategory] = useState(post.category || "");
  const [cpeGroup, setCpeGroup] = useState(post.cpeGroup || "");
  const [link, setLink] = useState(post.link || "");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const createPostMutation = useUpdatePost();
  
  // Popular emojis
  const popularEmojis = ["😀", "🎉", "🚀", "⭐", "🔥", "💯", "🏆", "📢", "💻", "👨‍💻", "👩‍💻", "🎓", "📚", "🧠", "🎯", "💡", "⚡", "🌈", "🎪", "🎊"];

  const doUpdatePost = (data) => {
    createPostMutation.mutate(data,
      {
        onSuccess: (res) => {
          console.log(res)
          setIsSubmitting(false);
        },

        onError: (error) => {
          console.log(error)
        }
      }
    )
    // setIsSubmitting(false);
  }
  // Parse date string (assuming format like "DD/MM/YYYY")
  function parseDate(dateStr) {
    if (!dateStr) return null;
    
    try {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // Convert DD/MM/YYYY to MM/DD/YYYY for JS Date
        return new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
      }
      return new Date(dateStr);
    } catch (e) {
      console.error("Error parsing date:", e);
      return null;
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const totalSize = validImages.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > 10 * 1024 * 1024) {
      alert("Total image size must not exceed 10 MB.");
      return;
    }

    if (images.length + validImages.length > 5) {
      alert("You can upload up to 5 images in total.");
      return;
    }

    setImages([...images, ...validImages]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    // Clear preview if showing
    if (imagePreview && imagePreview.index === index) {
      setImagePreview(null);
    }
  };

  const previewImage = (img, index) => {
    const url = img instanceof File ? URL.createObjectURL(img) : img;
    setImagePreview({
      url,
      name: img.name || `Image ${index + 1}`,
      size: img.size ? (img.size / 1024).toFixed(1) : "Unknown",
      index: index
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      alert("Please enter a title for your post.");
      return;
    }
    
    if (!content.trim()) {
      alert("Please enter content for your post.");
      return;
    }
    
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
  
    if (endDate < startDate) {
      alert("End date must be later than or equal to start date.");
      return;
    }
  
    if (!category) {
      alert("Please select a category.");
      return;
    }
  
    if (category === "Event News" && !cpeGroup) {
      alert("Please select a CPE group for Event News.");
      return;
    }
  
    if (link && !isValidUrl(link)) {
      alert("Please enter a valid URL starting with http:// or https://");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // สร้าง updatedPost object
      const data = {
        post_id: post.post_id,
        post_info: {
          title: title,
          // content: content,
        }
      }

      doUpdatePost(data)



      // const updatedPost = {
      //   ...post, // เก็บข้อมูลเดิมทั้งหมดไว้
      //   id: post.id, // ยืนยันว่ามี id
      //   title,
      //   content,
      //   emoji,
      //   images,
      //   startDate: startDate.toLocaleDateString("en-GB"),
      //   endDate: endDate.toLocaleDateString("en-GB"),
      //   category,
      //   cpeGroup: category === "Press release" ? "All" : cpeGroup,
      //   link,
      //   updatedAt: new Date().toISOString(),
      // };
      
      // console.log("Sending updated post to parent:", updatedPost); // เพิ่ม log
      // onSave(updatedPost); // เรียกฟังก์ชัน callback
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  // Click outside to close
  const modalRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Edit Post</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="5"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Event Dates <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Start Date"
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-10 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="relative">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="End Date"
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-10 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      minDate={startDate}
                      required
                    />
                    <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-10 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      required
                    >
                      <option value="" disabled>Select category</option>
                      <option value="Press release">Press release</option>
                      <option value="Event News">Event News</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                      <FaTag className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                {category === "Event News" && (
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      CPE Group <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={cpeGroup}
                        onChange={(e) => setCpeGroup(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-10 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        required={category === "Event News"}
                      >
                        <option value="" disabled>Select CPE group</option>
                        {Array.from({ length: 38 }, (_, i) => (
                          <option key={i} value={`CPE ${i + 1}`}>CPE {i + 1}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                        <FaUsers className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Event Link <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com/event"
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 pl-10 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLink className="text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Media & Emoji */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Select an Emoji <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <div className="grid grid-cols-10 gap-2">
                    {popularEmojis.map((emj) => (
                      <button
                        key={emj}
                        type="button"
                        onClick={() => setEmoji(emoji === emj ? "" : emj)}
                        className={`h-9 w-9 flex items-center justify-center text-xl rounded-lg transition-all ${
                          emoji === emj
                            ? "bg-blue-100 dark:bg-blue-900/30 shadow-inner border-2 border-blue-400 dark:border-blue-600 scale-110"
                            : "hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent"
                        }`}
                      >
                        {emj}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg h-12 w-12 flex items-center justify-center text-2xl mr-3">
                      {emoji || <FaSmile className="text-gray-300 dark:text-gray-600" />}
                    </div>
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        {emoji ? "Selected emoji" : "No emoji selected"} 
                      </p>
                      {emoji && (
                        <button 
                          type="button"
                          onClick={() => setEmoji("")}
                          className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Clear selection
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Images <span className="text-gray-500 font-normal">(Max 5)</span>
                </label>
                
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {images.map((img, index) => {
                      const imageUrl = img instanceof File ? URL.createObjectURL(img) : img;
                      return (
                        <div
                          key={index}
                          className={`relative group w-24 h-24 rounded-lg overflow-hidden border-2 ${
                            imagePreview && imagePreview.index === index
                              ? "border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                          onClick={() => previewImage(img, index)}
                        >
                          <img
                            src={imageUrl}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/100x100?text=Error";
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      );
                    })}
                    
                    {images.length < 5 && (
                      <label
                        htmlFor="imageUpload"
                        className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FaImage className="h-6 w-6 text-gray-400 dark:text-gray-500 mb-1" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Add Image</span>
                      </label>
                    )}
                    
                    <input
                      type="file"
                      id="imageUpload"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {imagePreview ? (
                    <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-start">
                        <img 
                          src={imagePreview.url} 
                          alt="Selected preview" 
                          className="w-20 h-20 object-cover rounded-lg mr-3"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/80x80?text=Error";
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-200 mb-1 truncate">
                            {imagePreview.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {imagePreview.size} KB
                          </p>
                          <button
                            type="button"
                            onClick={() => setImagePreview(null)}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
                          >
                            Close preview
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <p>Click on an image to preview. Total upload limit: 10MB</p>
                      <p className="mt-1">{5 - images.length} slots remaining</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editpostmodal;