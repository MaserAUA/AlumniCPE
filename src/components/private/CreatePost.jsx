import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaLink,
  FaImage,
  FaTimes,
  FaArrowLeft,
  FaTag,
  FaUsers,
  FaClock,
  FaInfoCircle,
  FaPlus,
  FaTrash,
  FaTrashAlt,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { useCreatePost } from "../../hooks/usePost";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { useUploadFile } from "../../api/upload";

const CreatePost = ({ onCreatePost }) => {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [category, setCategory] = useState("");
  const [selectedCPE, setSelectedCPE] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectLink, setRedirectLink] = useState("");
  const navigate = useNavigate();
  const createPostMutation = useCreatePost();
  const uploadFileMutation = useUploadFile();

  // Get user's CPE from localStorage
  const userCPE = localStorage.getItem("userCPE") || "";

  const doCreatePost = async (newPost) => {
    createPostMutation.mutate(newPost, {
      onSuccess: (res) => {
        console.log("Post created successfully:", res);
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
          navigate("/homeuser");
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
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      
      // ตรวจสอบขนาดไฟล์ทั้งหมด
      const totalSize = newImages.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > 10 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Size Exceeded",
          text: "Total file size should not exceed 10MB",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      // ตรวจสอบจำนวนรูปภาพ
      if (images.length + newImages.length > 5) {
        Swal.fire({
          icon: "error",
          title: "Too Many Images",
          text: "You can upload up to 5 images",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      // ตรวจสอบประเภทไฟล์
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const invalidFiles = newImages.filter(file => {
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        return !validTypes.includes(file.type) || !validExtensions.includes(fileExtension);
      });

      if (invalidFiles.length > 0) {
        Swal.fire({
          icon: "warning",
          title: "Invalid File Type",
          text: "Only JPG, PNG, and WebP files are allowed",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      setImages(prev => [...prev, ...newImages]);
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetFields = () => {
    setTitle("");
    setContent("");
    setImages([]);
    setImagePreviews([]);
    setStartDate(null);
    setEndDate(null);
    setCategory("");
    setSelectedCPE("");
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
      "Event News": "event",
      "Announcement": "announcement"
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

    // Validate CPE selection for announcement
    if (post_type === "announcement" && !selectedCPE) {
      Swal.fire({
        icon: "error",
        title: "Missing CPE",
        text: "Please select a CPE group for your announcement.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (post_type === "event") {
      if (!startDate || !endDate) {
        Swal.fire({
          icon: "error",
          title: "Missing Dates",
          text: "Please select both start and end dates for your event.",
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
    }

    setIsSubmitting(true);

    try {
      const formatDateToISO = (date) => {
        if (!date) return null;
        const d = new Date(date);
        d.setHours(10, 30, 0, 0);
        return d.toISOString();
      };

      // Upload images first
      const uploadedImageUrls = [];
      for (const image of images) {
        try {
          const result = await uploadFileMutation.mutateAsync(image);
          // Convert relative URL to absolute URL
          const absoluteUrl = `https://alumni.cpe.kmutt.ac.th${result.url}`;
          uploadedImageUrls.push(absoluteUrl);
        } catch (error) {
          console.error("Upload error:", error);
          Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: error.message || "Failed to upload image. Please try again.",
            confirmButtonColor: "#3085d6",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const postData = {
        title: title.trim(),
        content: content.trim(),
        post_type: post_type,
        start_date: post_type === "event" ? formatDateToISO(startDate) : null,
        end_date: post_type === "event" ? formatDateToISO(endDate) : null,
        visibility: post_type === "announcement" ? selectedCPE : "all",
        media_urls: uploadedImageUrls,
        redirect_link: redirectLink.trim() || ""
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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-blue-700">
        {/* Header */}

        <div className="container mx-auto px-4 pt-6 pb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700 transition-colors py-2 px-4 rounded-lg shadow-md mb-8"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Create Event Post
          </h1>
          <p className="text-blue-100 text-center max-w-2xl mx-auto text-lg">
            Share your upcoming events, announcements, and updates with the CPE
            community
          </p>
        </div>

        {/* Main form */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto transform transition-transform duration-300 hover:shadow-3xl">
            <div className="p-8 md:p-10">
              {/* Form content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Event Details */}
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a catchy name for your event"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Describe what's happening, who should attend, and any important details..."
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      rows="5"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Event Dates <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Start Date"
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      </div>
                      <div className="relative">
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="End Date"
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          minDate={startDate}
                        />
                        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          if (e.target.value === "Event News") {
                            setSelectedCPE("");
                          }
                        }}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pr-10 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="" disabled>
                          Select category
                        </option>
                        <option value="Event News">Event News</option>
                        <option value="Announcement">Announcement</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FaTag className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {category === "Announcement" && (
                    <div className="mb-6">
                      <label className="block text-gray-700 font-semibold mb-2">
                        CPE Group <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCPE}
                          onChange={(e) => setSelectedCPE(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pr-10 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                          <option value="" disabled>
                            Select CPE Group
                          </option>
                          {Array.from({ length: 38 }, (_, i) => (
                            <option 
                              key={i} 
                              value={`CPE ${i + 1}`}
                              disabled={userCPE !== `CPE ${i + 1}`}
                            >
                              CPE {i + 1}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <FaUsers className="h-4 w-4" />
                        </div>
                      </div>
                      {userCPE && (
                        <p className="mt-2 text-sm text-gray-500">
                          You can only post announcements for {userCPE}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column - Media & Emoji */}
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      External Link <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={redirectLink}
                        onChange={(e) => setRedirectLink(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FaLink className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a URL for external links (YouTube, website, etc.)
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imagePreviews.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "https://via.placeholder.com/400x400?text=Image Not Found";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <FaTrashAlt size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      <FaImage className="mr-2" /> Add Images
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        multiple
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                      />
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload up to 5 images (JPG, PNG, WebP). Total size should not exceed 10MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
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
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  disabled={isSubmitting}
                >
                  Reset Form
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-blue-600 rounded-lg text-white font-medium shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={handleChatClick}
              className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
              aria-label="Open chat"
            >
              <IoChatbubbleEllipses size={28} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
