import React, { useState, useRef, useEffect } from "react";
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { EditProfileAction } from '../../components/profile/EditProfileAction';
import { EditProfileForm } from '../../components/profile/EditProfileForm';
import { SuccessUserModal } from '../../components/profile/SuccessUserModal';
import { DeleteUserModal } from '../../components/profile/DeleteUserModal';
import { ConfirmEditUserModal } from '../../components/profile/ConfirmEditUserModal';
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useUpdateUserById } from "../../hooks/useUser"
import {
  initialFormData,
  SectionKey,
  sectionKeys,
  formSteps
} from "../../models/formUtils";
import { UpdateUserFormData } from "../../models/user";
import { useAuthContext } from "../../context/auth_context";
import { useGetUserById } from "../../hooks/useUser"
import { a } from "framer-motion/dist/types.d-6pKw1mTI";
import { defaults } from "chart.js";
import { cleanObject } from "../../utils/format";

const EditProfile = () => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [newProfileImage, setNewProfileImage] = useState<string>("");

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("personal")

  const updateUserByIdMutation = useUpdateUserById()

  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const { userId } = useAuthContext()
  const { data: userData, isLoading: isLoadingUser} = useGetUserById(userId || "")
  const [formData, setFormData] = useLocalStorage<UpdateUserFormData>(
    "edit-profile",
    initialFormData
  );

  useEffect(() => {
    if (userData && !hasChanges) {
      const excludedKeys = new Set(["email"]);
      const flattenedData: Record<string, any> = {};

      Object.keys(userData).forEach((key) => {
        if (excludedKeys.has(key)) {
          return; // skip excluded keys
        }

        const value = (userData as any)[key];
        if (value && typeof value === "object" && !Array.isArray(value)) {
          // Flatten one level deep
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            flattenedData[nestedKey] = nestedValue;
          });
        } else {
          flattenedData[key] = value;
        }
      });

      setFormData(() => ({
        ...initialFormData,
        ...flattenedData,
      }));
    }
  }, [userData, hasChanges]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setNewProfileImage(reader.result?.toString() || "");
        setShowConfirmModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true)
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      // const cleanedFormData = Object.fromEntries(
      //   Object.entries(formData).filter(([_, value]) => value !== "")
      // );
      // const cleanedPaylyyoad = cleanObject()
      updateUserByIdMutation.mutate(formData);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  if (isLoadingUser) {
    return (<div>loading. . .</div>)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-800 p-4 md:p-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header with profile summary */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 py-8 px-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <img
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg transition-all group-hover:border-blue-200"
                src={userData.profile_picture != "" ?
                  `https://ui-avatars.com/api/?name=${userData.username}&background=0D8ABC&color=fff`
                  : userData.profile_picture
                }
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${userData.username}&background=0D8ABC&color=fff`;
                }}
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
                {userData.name}
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
            {sectionKeys.map((section) => (
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
              <EditProfileForm
                formData={formData}
                // setFormData={setFormData}
                handleChange={handleChange}
                currentFields={formSteps[activeSection]}
              />
              <EditProfileAction
                hasChanges={hasChanges}
                isLoading={isLoading}
                onShowDelete={()=>setShowDeleteModal(true)}
                onShowDiscard={()=>
                  setHasChanges(false)
                }
                onShowSave={()=>{
                  handleSubmit()
                  setShowSuccessModal(true);
                  setHasChanges(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      { showDeleteModal && (
        <DeleteUserModal
          onClose={()=>setShowDeleteModal(false)}
        />
      )}

      {/* Confirm Image Change Modal */}
      { showConfirmModal && (
        <ConfirmEditUserModal
          profileImage={userData.profile_picture}
          newProfileImage={newProfileImage}
          onCancel={()=>{
            setNewProfileImage("");
            setShowConfirmModal(false);
          }}
          onConfirm={()=>{
            setFormData((prev)=>({
              ...prev,
              profile_picture: newProfileImage || ""
            }));
            setShowConfirmModal(false);
            setHasChanges(true);
          }}
        />
      )}
      
      {/* Success Modal */}
      { showSuccessModal && (
        <SuccessUserModal
          activeSection={activeSection}
          successMessage={successMessage}
          onDone={()=>setShowSuccessModal(false)}
        />
      )}

      {/* Chat Button */}
      {
        // <div className="fixed bottom-6 right-6 z-50">
        //   <button
        //     onClick={handleChatClick}
        //     className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200"
        //     aria-label="Open chat"
        //   >
        //     <IoChatbubbleEllipses size={28} />
        //   </button>
        // </div>
      }

      {/* Add these keyframes to your CSS */}
      {
      // <style jsx>{`
      //   @keyframes fade-in {
      //     from { opacity: 0; transform: scale(0.95); }
      //     to { opacity: 1; transform: scale(1); }
      //   }
      //   .animate-fade-in {
      //     animation: fade-in 0.2s ease-out;
      //   }
      //   .no-scrollbar::-webkit-scrollbar {
      //     display: none;
      //   }
      //   .no-scrollbar {
      //     -ms-overflow-style: none;
      //     scrollbar-width: none;
      //   }
      // `}</style>
      }
    </div>
  );
}
export default EditProfile
