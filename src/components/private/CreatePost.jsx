import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaLink, FaImage, FaSmile, FaTimes, FaArrowLeft, FaTag, FaUsers, FaClock, FaInfoCircle, FaPlus, FaTrash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { useCreatePost } from "../../api/post";


const CreatePost = ({ onCreatePost }) => {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emoji, setEmoji] = useState("");
  const [images, setImages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [category, setCategory] = useState("");
  const [cpeGroup, setCpeGroup] = useState("");
  const [link, setLink] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Event Schedule and Information
  const [scheduleItems, setScheduleItems] = useState([{ time: "", title: "", description: "" }]);
  const [organizer, setOrganizer] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [venue, setVenue] = useState("");
  const createPostMutation = useCreatePost()
  
  // Popular emojis
  const popularEmojis = ["😀", "🎉", "🚀", "⭐", "🔥", "💯", "🏆", "📢", "💻", "👨‍💻", "👩‍💻", "🎓", "📚", "🧠", "🎯", "💡", "⚡", "🌈", "🎪", "🎊"];
  
  const doCreatePost = async (newPost) => {

    createPostMutation.mutate(newPost,
      {
        onSuccess: (res) => {
          console.log(res)
        },
        onError: (error) => {
          console.log(error)
        }
      }
    )

  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) =>
      file.type.startsWith("image/")
    );

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
      index: index
    });
  };

  // Schedule item handlers
  const addScheduleItem = () => {
    if (scheduleItems.length < 5) {
      setScheduleItems([...scheduleItems, { time: "", title: "", description: "" }]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Maximum Schedule Items",
        text: "You can add up to 5 schedule items.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const removeScheduleItem = (index) => {
    const updatedSchedule = [...scheduleItems];
    updatedSchedule.splice(index, 1);
    setScheduleItems(updatedSchedule);
  };

  const updateScheduleItem = (index, field, value) => {
    const updatedSchedule = [...scheduleItems];
    updatedSchedule[index][field] = value;
    setScheduleItems(updatedSchedule);
  };

  const resetFields = () => {
    setTitle("");
    setContent("");
    setEmoji("");
    setImages([]);
    setStartDate(null);
    setEndDate(null);
    setCategory("");
    setCpeGroup("");
    setLink("");
    setImagePreview(null);
    setScheduleItems([{ time: "", title: "", description: "" }]);
    setOrganizer("");
    setContactEmail("");
    setContactPhone("");
    setVenue("");
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleShare = async () => {
    // Validation
    if (!title.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Event Name",
        text: "Please enter a name for your event.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    
    if (!content.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Content",
        text: "Please describe what's happening in your event.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    
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

    if (!category) {
      Swal.fire({
        icon: "error",
        title: "Missing Category",
        text: "Please select a category for your post.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (category === "Event News" && !cpeGroup) {
      Swal.fire({
        icon: "warning",
        title: "CPE Group Missing",
        text: "Please select a CPE group for Event News.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (link && !isValidUrl(link)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid URL",
        text: "Please enter a valid URL starting with http:// or https://",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    
    // Validate schedule items if any are filled
    const hasScheduleItems = scheduleItems.some(item => item.time || item.title || item.description);
    if (hasScheduleItems) {
      const invalidSchedule = scheduleItems.some(item => 
        (item.time && !item.title) || (!item.time && item.title)
      );
      
      if (invalidSchedule) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Schedule Items",
          text: "Please ensure all schedule items have both time and title filled.",
          confirmButtonColor: "#3085d6",
        });
        return;
      }
    }
    
    // Validate contact email if provided
    if (contactEmail && !validateEmail(contactEmail)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty schedule items
      const filteredSchedule = scheduleItems.filter(item => item.time && item.title);
      
      // Prepare event information
      const eventInfo = {
        organizer: organizer || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        venue: venue || null
      };
      
      // หากเลือก Press release ให้โพสต์นี้แสดงในทุก CPE
      const postData = {
        id: Date.now().toString(), // Generate unique ID
        title,
        content,
        emoji,
        images,
        startDate: startDate.toLocaleDateString("en-GB"),
        endDate: endDate.toLocaleDateString("en-GB"),
        category,
        cpeGroup: category === "Press release" ? "All" : cpeGroup,
        link,
        schedule: filteredSchedule.length > 0 ? filteredSchedule : null,
        eventInfo: Object.values(eventInfo).some(val => val !== null) ? eventInfo : null,
        createdBy: localStorage.getItem("username") || "anonymous",
        createdAt: new Date().toISOString(),
        likeCount: 0,
      };

      const data = {
        title,
        content,
        "post_type": "event",
        "visibility": "all"
    }

      // onCreatePost(postData);
      await doCreatePost(data);
      
      Swal.fire({
        icon: "success",
        title: "Post Created!",
        text: "Your event has been posted successfully.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // setTimeout(() => {
      //   navigate("/homeuser");
      //   resetFields();
      // }, 2000);
    } catch (error) {
      console.error("Error creating post:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
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
        
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">Create Event Post</h1>
        <p className="text-blue-100 text-center max-w-2xl mx-auto text-lg">
          Share your upcoming events, announcements, and updates with the CPE community
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pr-10 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="" disabled>Select category</option>
                        <option value="Press release">Press release</option>
                        <option value="Event News">Event News</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FaTag className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  
                  {category === "Event News" && (
                    <div className="mb-6">
                      <label className="block text-gray-700 font-semibold mb-2">
                        CPE Group <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={cpeGroup}
                          onChange={(e) => setCpeGroup(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pr-10 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                          <option value="" disabled>Select CPE group</option>
                          {Array.from({ length: 38 }, (_, i) => (
                            <option key={i} value={`CPE ${i + 1}`}>CPE {i + 1}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <FaUsers className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Event Link <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://example.com/event"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaLink className="text-gray-500" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Include a link for registration or more information</p>
                </div>
              </div>
              
              {/* Right Column - Media & Emoji */}
              <div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Select an Emoji <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-10 gap-2">
                      {popularEmojis.map((emj) => (
                        <button
                          key={emj}
                          type="button"
                          onClick={() => setEmoji(emoji === emj ? "" : emj)}
                          className={`h-9 w-9 flex items-center justify-center text-xl rounded-lg transition-all ${
                            emoji === emj
                              ? "bg-blue-100 shadow-inner border-2 border-blue-400 scale-110"
                              : "hover:bg-gray-100 border border-transparent"
                          }`}
                        >
                          {emj}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      <div className="bg-white border border-gray-200 rounded-lg h-12 w-12 flex items-center justify-center text-2xl mr-3">
                        {emoji || <FaSmile className="text-gray-300" />}
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">
                          {emoji ? "Selected emoji" : "No emoji selected"} 
                        </p>
                        {emoji && (
                          <button 
                            type="button"
                            onClick={() => setEmoji("")}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Clear selection
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Upload Images <span className="text-gray-500 font-normal">(Optional, max 5)</span>
                  </label>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-wrap gap-3 mb-4">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className={`relative group w-24 h-24 rounded-lg overflow-hidden border-2 ${
                            imagePreview && imagePreview.index === index
                              ? "border-blue-500 ring-2 ring-blue-300"
                              : "border-gray-200"
                          }`}
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
                            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                      
                      {images.length < 5 && (
                        <label
                          htmlFor="imageUpload"
                          className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <FaImage className="h-6 w-6 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">Add Image</span>
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
                      <div className="mt-4 bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start">
                          <img 
                            src={imagePreview.url} 
                            alt="Selected preview" 
                            className="w-20 h-20 object-cover rounded-lg mr-3"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 mb-1 truncate">
                              {imagePreview.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {imagePreview.size} KB
                            </p>
                            <button
                              type="button"
                              onClick={() => setImagePreview(null)}
                              className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                            >
                              Close preview
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mt-1">
                        <p>Click on an image to preview. Total upload limit: 10MB</p>
                        <p className="mt-1">{5 - images.length} slots remaining</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Event Schedule Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaClock className="mr-2 text-blue-500" />
                  Event Schedule
                  <span className="text-gray-500 font-normal text-sm ml-2">(Optional)</span>
                </h2>
                <button
                  type="button"
                  onClick={addScheduleItem}
                  className="flex items-center text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors py-1 px-3 rounded-lg"
                >
                  <FaPlus className="mr-1" size={12} />
                  Add Item
                </button>
              </div>
              
              {scheduleItems.map((item, index) => (
                <div key={index} className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Schedule Item #{index + 1}</h3>
                    {scheduleItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeScheduleItem(index)}
                        className="text-red-500 hover:text-red-700 flex items-center text-sm"
                      >
                        <FaTrash className="mr-1" size={12} />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => updateScheduleItem(index, "time", e.target.value)}
                        placeholder="e.g. 10:00 AM"
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateScheduleItem(index, "title", e.target.value)}
                        placeholder="e.g. Opening Ceremony"
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-1">
                        Description <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateScheduleItem(index, "description", e.target.value)}
                        placeholder="Brief description"
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <p className="text-sm text-gray-500 mt-2">
                {scheduleItems.length >= 5 
                  ? "Maximum of 5 schedule items reached" 
                  : `You can add up to ${5 - scheduleItems.length} more schedule items`}
              </p>
            </div>
            
            {/* Event Information Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Event Information
                <span className="text-gray-500 font-normal text-sm ml-2">(Optional)</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Organized by
                  </label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="e.g. Student Council, Department Name"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Auditorium, Room 301"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. event@example.com"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 099-999-9999"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  Swal.fire({
                    title: 'Discard changes?',
                    text: "All your entered information will be lost.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, discard',
                    cancelButtonText: 'No, keep editing'
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
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
      </div>
    </div>
    </>
  );
};

export default CreatePost;