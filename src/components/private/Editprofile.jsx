import React, { useState, useEffect } from "react";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    workingCompany: "",
    jobPosition: "",
    lineOfWork: "",
    cpeModel: "",
    salary: "",
    sex: "",
    nation: "",
    studentID: "",
    favoriteSubject: "",
    privacySettings: {
      firstName: false,
      lastName: false,
      email: false,
      phone: false,
      workingCompany: false,
      jobPosition: false,
      lineOfWork: false,
      cpeModel: false,
      salary: false,
      sex: false,
      nation: false,
      studentID: false,
      favoriteSubject: false,
    },
  });

  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/120"
  );
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [formErrors, setFormErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load saved data if exists
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const parsedData = JSON.parse(savedProfile);
      setFormData(parsedData);
      if (parsedData.profileImage) {
        setProfileImage(parsedData.profileImage);
      }
    }
  }, []);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [formData, profileImage]);

  // Field groups for better organization (removed security section)
  const fieldGroups = {
    personal: ["firstName", "lastName", "email", "phone", "sex", "nation"],
    professional: ["workingCompany", "jobPosition", "lineOfWork", "salary", "cpeModel"],
    academic: ["studentID", "favoriteSubject"],
  };

  // Field labels for better readability
  const fieldLabels = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    workingCompany: "Company",
    jobPosition: "Job Position",
    lineOfWork: "Industry",
    cpeModel: "CPE Model",
    salary: "Salary",
    sex: "Gender",
    nation: "Nationality",
    studentID: "Student ID",
    favoriteSubject: "Favorite Subject",
  };

  // Input types for appropriate data entry
  const fieldTypes = {
    email: "email",
    phone: "tel",
    salary: "number",
    studentID: "text",
  };

  // handle input text with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({...prev, [name]: null}));
    }
  };

  // handle checkbox (privacy settings)
  const handlePrivacyChange = (field) => {
    setFormData((prevState) => ({
      ...prevState,
      privacySettings: {
        ...prevState.privacySettings,
        [field]: !prevState.privacySettings[field],
      },
    }));
  };

  // handle image upload with preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setNewProfileImage(reader.result);
        setShowConfirmModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmImageChange = () => {
    setProfileImage(newProfileImage);
    setNewProfileImage(null);
    setShowConfirmModal(false);
    setHasChanges(true);
  };

  const handleCancelImageChange = () => {
    setNewProfileImage(null);
    setShowConfirmModal(false);
  };

  // Validate form before saving
  const validateForm = () => {
    const errors = {};
    
    // Basic validation
    if (!formData.email && activeSection === "personal") {
      errors.email = "Email is required";
    } else if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      errors.phone = "Phone should be 10 digits";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save data with validation and feedback
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      // Save data to localStorage
      const dataToSave = {
        ...formData,
        profileImage,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem("userProfile", JSON.stringify(dataToSave));
      
      setLoading(false);
      setHasChanges(false);
      setShowSuccessModal(true);
    }, 800);
  };

  // Discard changes
  const handleDiscard = () => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const parsedData = JSON.parse(savedProfile);
      setFormData(parsedData);
      if (parsedData.profileImage) {
        setProfileImage(parsedData.profileImage);
      }
    } else {
      // Reset to default
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        workingCompany: "",
        jobPosition: "",
        lineOfWork: "",
        cpeModel: "",
        salary: "",
        sex: "",
        nation: "",
        studentID: "",
        favoriteSubject: "",
        privacySettings: {
          firstName: false,
          lastName: false,
          email: false,
          phone: false,
          workingCompany: false,
          jobPosition: false,
          lineOfWork: false,
          cpeModel: false,
          salary: false,
          sex: false,
          nation: false,
          studentID: false,
          favoriteSubject: false,
        },
      });
      setProfileImage("https://via.placeholder.com/120");
    }
    setHasChanges(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-800 p-4 md:p-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with profile summary */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 py-8 px-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg transition-all group-hover:border-blue-200"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition-all">
                <label className="opacity-0 group-hover:opacity-100 cursor-pointer bg-white text-blue-800 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:bg-blue-50">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            <div className="text-center md:text-left text-white">
              <h1 className="text-3xl md:text-4xl font-bold">Edit Your Profile</h1>
              <p className="mt-2 text-blue-100">
                {formData.firstName || formData.lastName ? 
                  `${formData.firstName} ${formData.lastName}` : 
                  "Complete your profile to help us personalize your experience"}
              </p>
              {hasChanges && (
                <p className="text-yellow-200 mt-2 text-sm">
                  * You have unsaved changes
                </p>
              )}
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex mt-8 border-b border-blue-500 overflow-x-auto no-scrollbar">
            {Object.keys(fieldGroups).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-6 py-3 text-sm md:text-base font-medium whitespace-nowrap transition-all ${
                  activeSection === section
                    ? "text-white border-b-2 border-white"
                    : "text-blue-200 hover:text-white"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)} Info
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          <div className="grid gap-8">
            {/* Current Section Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {fieldGroups[activeSection].map((field) => (
                  <div key={field} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        {fieldLabels[field] || field}
                      </label>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">Hide</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.privacySettings[field]}
                            onChange={() => handlePrivacyChange(field)}
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={fieldTypes[field] || "text"}
                        name={field}
                        id={field}
                        value={formData[field] || ""}
                        onChange={handleInputChange}
                        className={`block w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                          formErrors[field] 
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors`}
                        placeholder={`Enter your ${fieldLabels[field] || field}`}
                      />
                      {formErrors[field] && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors[field]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleDiscard}
                disabled={!hasChanges || loading}
                className={`px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium transition-colors ${
                  hasChanges && !loading
                    ? "hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                Discard Changes
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || loading}
                className={`px-8 py-2.5 rounded-lg bg-blue-600 text-white font-medium transition-colors ${
                  hasChanges && !loading
                    ? "hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                    : "opacity-50 cursor-not-allowed"
                } flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Image Change Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Change Profile Picture?</h3>
            <div className="flex justify-center items-center gap-8 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Current</p>
                <img
                  src={profileImage}
                  alt="Current Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              <div className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">New</p>
                {newProfileImage && (
                  <img
                    src={newProfileImage}
                    alt="New Profile Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-300"
                  />
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelImageChange}
                className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImageChange}
                className="flex-1 py-2.5 px-4 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Profile Updated Successfully!</h3>
            <p className="text-gray-600 text-center mb-6">
              Your changes have been saved and will be visible to others based on your privacy settings.
            </p>
            <button
              onClick={handleCloseSuccessModal}
              className="w-full py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Add these keyframes to your CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default EditProfile;