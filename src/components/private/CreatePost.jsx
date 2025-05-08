import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaLink,
  FaImage,
  FaTimes,
  FaTag,
  FaNewspaper,
  FaBullhorn,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { useCreatePost } from "../../hooks/usePost";
import { useUploadFile } from "../../hooks/useUploadFile";
import { IoChatbubbleEllipses } from "react-icons/io5";
import AOS from "aos";
import "aos/dist/aos.css";

const CreatePost = ({ onCreatePost }) => {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [category, setCategory] = useState("");
  const [selectedCPE, setSelectedCPE] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectLink, setRedirectLink] = useState("");
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();
  const uploadFileMutation = useUploadFile();

  // Get user's CPE from localStorage
  const userCPE = localStorage.getItem("userCPE") || "";

  const postTypeOptions = [
    { value: 'event', label: 'Event' },
    { value: 'story', label: 'Story' },
    { value: 'job', label: 'Job' },
    { value: 'mentorship', label: 'Mentorship' },
    { value: 'showcase', label: 'Showcase' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'survey', label: 'Survey' },
    { value: 'cpe', label: 'CPE' },
  ];

  const doCreatePost = async (newPost) => {
    createPostMutation.mutate(newPost, {
      onSuccess: (res) => {
        //console.log("Post created successfully:", res);
        // แสดง Swal หลังจากสร้างโพสต์สำเร็จ
        Swal.fire({
          icon: "success",
          title: "Post Created!",
          text: "Your event has been posted successfully.",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        
        setTimeout(() => {
          navigate("/newsuser");
          resetFields();
        }, 2000);
      },
      onError: (error) => {
        console.error("Error creating post:", error);
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: "Please try again later.",
          confirmButtonColor: "#3085d6",
        });
        setIsSubmitting(false);
      },
    });
  };

  const handleChatClick = () => {
    navigate("/chatpage");
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    const totalSize = validImages.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Size Exceeded",
        text: "Total image size must not exceed 10 MB.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (images.length + validImages.length > 5) {
      Swal.fire({
        icon: "error",
        title: "Too Many Images",
        text: "You can upload up to 5 images in total.",
        confirmButtonColor: "#3085d6",
      });
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
    setImagePreview({
      url: URL.createObjectURL(img),
      name: img.name,
      size: (img.size / 1024).toFixed(1),
      index: index,
    });
  };

  const resetFields = () => {
    setTitle("");
    setContent("");
    setImages([]);
    setStartDate(null);
    setEndDate(null);
    setCategory("");
    setSelectedCPE("");
    setImagePreview(null);
    setRedirectLink("");
  };

  const handleShare = async () => {
    // Validation
    if (!title.trim() || title.length < 3 || title.length > 100) {
      Swal.fire({
        icon: "error",
        title: "Invalid Title",
        text: "Title must be between 3 and 100 characters.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!content.trim() || content.length < 10 || content.length > 500) {
      Swal.fire({
        icon: "error",
        title: "Invalid Content",
        text: "Content must be between 10 and 500 characters.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (redirectLink && !isValidUrl(redirectLink)) {
      Swal.fire({
        icon: "error",
        title: "Invalid URL",
        text: "Please enter a valid URL starting with http:// or https://",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!category) {
      Swal.fire({
        icon: "error",
        title: "Missing Category",
        text: "Please select a category for your post.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const postTypeMap = {
      "event": "event",
      "story": "story",
      "job": "job",
      "mentorship": "mentorship",
      "showcase": "showcase",
      "announcement": "announcement",
      "discussion": "discussion",
      "survey": "survey",
      "cpe": "cpe"
    };

    const post_type = postTypeMap[category];
    if (!post_type) {
      Swal.fire({
        icon: "error",
        title: "Invalid Post Type",
        text: "Please select a valid category.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (post_type === "cpe" && !selectedCPE) {
      Swal.fire({
        icon: "error",
        title: "Missing CPE",
        text: "Please select a CPE group for your post.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Date validation for all post types
    if (!startDate || !endDate) {
      Swal.fire({
        icon: "error",
        title: "Missing Dates",
        text: "Please select both start and end dates.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (endDate < startDate) {
      Swal.fire({
        icon: "error",
        title: "Invalid Dates",
        text: "End date must be later than or equal to start date.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formatDateToISO = (date) => {
        if (!date) return null;
        const d = new Date(date);
        d.setHours(10, 30, 0, 0);
        return d.toISOString();
      };

      // Upload all images first
      const uploadedResults = await Promise.all(
        images.map((file) => uploadFileMutation.mutateAsync(file))
      );

      const media_urls = uploadedResults.map((result) => result.url);

      const postData = {
        title: title.trim(),
        content: content.trim(),
        post_type: post_type,
        start_date: formatDateToISO(startDate),
        end_date: formatDateToISO(endDate),
        visibility: post_type === "cpe" ? selectedCPE : "all",
        media_urls: media_urls,
        redirect_link: redirectLink.trim() || null
      };

      if (!postData.title || !postData.content || !postData.post_type) {
        throw new Error("Required fields are missing");
      }

      await doCreatePost(postData);
      
    } catch (error) {
      console.error("Error creating post:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: error.message || "Please try again later.",
        confirmButtonColor: "#3085d6",
      });
      setIsSubmitting(false);
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

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 0,
      startEvent: 'DOMContentLoaded',
      disable: 'mobile',
      mirror: false,
    });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
        {/* Header */}
        <div className="container mx-auto px-4 pt-6 pb-12">
          <div className="flex flex-col items-center justify-center space-y-4" data-aos="fade-down">
            <div className="flex items-center space-x-4">
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4 mt-8 flex items-center justify-center" data-aos="zoom-in" data-aos-delay="50">
              <FaNewspaper className="text-white text-5xl animate-bounce mr-4" />
              Create Post
              <FaBullhorn className="text-white text-5xl animate-bounce ml-4" />
            </h1>
            <p className="text-blue-100 text-center max-w-2xl mx-auto text-xl" data-aos="fade-up" data-aos-delay="100">
              Share your upcoming events, announcements, and updates with the CPE
              community
            </p>
          </div>
        </div>

        {/* Main form */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto transform transition-all duration-300 hover:shadow-3xl" data-aos="fade-up" data-aos-delay="150">
            <div className="p-8 md:p-10">
              {/* Form content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Event Details */}
                <div data-aos="fade-right" data-aos-delay="200">
                  <div className="mb-6">
                    <label className="block text-gray-800 text-lg font-semibold mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a catchy title for your post"
                      className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="mb-6" data-aos="fade-right" data-aos-delay="250">
                    <label className="block text-gray-800 text-lg font-semibold mb-2">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Describe your post content..."
                      className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      rows="5"
                    />
                  </div>

                  <div className="mb-6" data-aos="fade-right" data-aos-delay="300">
                    <label className="block text-gray-800 text-lg font-semibold mb-2">
                      Post Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          if (e.target.value !== "cpe") {
                            setSelectedCPE("");
                          }
                        }}
                        className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 pr-10 text-lg text-gray-900 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="" disabled>
                          Select post type
                        </option>
                        {postTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FaTag className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {category === "cpe" && (
                    <div className="mb-6" data-aos="fade-right" data-aos-delay="350">
                      <label className="block text-gray-800 text-lg font-semibold mb-2">
                        CPE Group <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCPE}
                          onChange={(e) => setSelectedCPE(e.target.value)}
                          className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 pr-10 text-lg text-gray-900 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="" disabled>
                            Select CPE group
                          </option>
                          {Array.from({ length: 38 }, (_, i) => (
                            <option key={i} value={`CPE ${i + 1}`}>
                              CPE {i + 1}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <FaTag className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-6" data-aos="fade-right" data-aos-delay="300">
                    <label className="block text-gray-800 text-lg font-semibold mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Start Date"
                          className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 pr-10 text-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      </div>
                      <div className="relative">
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="End Date"
                          className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 pr-10 text-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          minDate={startDate}
                        />
                        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Media and Links */}
                <div data-aos="fade-left" data-aos-delay="200">
                  <div className="mb-6" data-aos="fade-left" data-aos-delay="250">
                    <label className="block text-gray-800 text-lg font-semibold mb-2">
                      Redirect Link <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={redirectLink}
                        onChange={(e) => setRedirectLink(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 pr-10 text-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FaLink className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-2 text-base text-gray-600">
                      Enter a URL for Link(YouTube, Vimeo, etc.)
                    </p>
                  </div>

                  <div className="mb-6" data-aos="fade-left" data-aos-delay="300">
                    <label className="block text-gray-800 text-lg font-semibold mb-2">
                      Media URLs <span className="text-gray-500 font-normal">(Optional, max 5)</span>
                    </label>

                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                      <div className="flex flex-wrap gap-4 mb-4">
                        {images.map((img, index) => (
                          <div
                            key={index}
                            className={`relative group w-28 h-28 rounded-lg overflow-hidden border-2 ${
                              imagePreview && imagePreview.index === index
                                ? "border-blue-500 ring-2 ring-blue-300"
                                : "border-gray-200"
                            } transition-all duration-300 hover:scale-105`}
                            onClick={() => previewImage(img, index)}
                          >
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                              aria-label="Remove image"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}

                        {images.length < 5 && (
                          <label
                            htmlFor="imageUpload"
                            className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                          >
                            <FaImage className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Add Image
                            </span>
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
                        <div className="mt-4 bg-white border-2 border-gray-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <img
                              src={imagePreview.url}
                              alt="Selected preview"
                              className="w-24 h-24 object-cover rounded-lg mr-4"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-lg mb-2 truncate">
                                {imagePreview.name}
                              </p>
                              <p className="text-base text-gray-600">
                                {imagePreview.size} KB
                              </p>
                              <button
                                type="button"
                                onClick={() => setImagePreview(null)}
                                className="text-base text-blue-600 hover:text-blue-800 mt-2 transition-colors duration-300"
                              >
                                Close preview
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-base text-gray-600 mt-2">
                          <p>
                            Click on an image to preview. Total upload limit:
                            10MB
                          </p>
                          <p className="mt-2">
                            {5 - images.length} slots remaining
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10 pt-8 border-t border-gray-200" data-aos="fade-up" data-aos-delay="400">
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Discard changes?",
                      text: "All your entered information will be lost.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, discard",
                      cancelButtonText: "No, keep editing",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        resetFields();
                      }
                    });
                  }}
                  className="px-8 py-4 bg-white border-2 border-gray-300 rounded-lg text-gray-700 text-lg font-medium hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transform hover:-translate-y-1 hover:shadow-lg"
                  disabled={isSubmitting}
                >
                  Reset Form
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  disabled={isSubmitting}
                  className={`px-8 py-4 bg-blue-600 rounded-lg text-white text-lg font-medium shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-1 hover:shadow-xl ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Posting...
                    </div>
                  ) : (
                    "Share Event"
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50" data-aos="fade-up" data-aos-delay="450">
            <button
              onClick={handleChatClick}
              className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 hover:shadow-xl"
              aria-label="Open chat"
            >
              <IoChatbubbleEllipses size={32} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
