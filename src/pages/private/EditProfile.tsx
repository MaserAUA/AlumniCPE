import React, { useState, useRef, useEffect } from "react";
import { IoChatbubbleEllipses, IoPerson, IoBusiness, IoSchool, IoMail, IoLockClosed, IoTrash, IoImage, IoBook, IoCall } from 'react-icons/io5';
import { FaUserEdit, FaSave, FaUndo } from 'react-icons/fa';
import { EditProfileAction } from '../../components/Profile/EditProfileAction';
import { EditProfileForm } from '../../components/Profile/EditProfileForm';
import { SuccessUserModal } from '../../components/Profile/SuccessUserModal';
import { DeleteUserModal } from '../../components/Profile/DeleteUserModal';
import { PasswordResetModal } from "../../components/Profile/PasswordResetModal";
import { ConfirmEditUserModal } from '../../components/Profile/ConfirmEditUserModal';
import { ChangeEmailModal } from "../../components/Profile/ChangeEmailModal";
import { useUploadFile } from "../../hooks/useUploadFile";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useUpdateUserById, useUpdateStudentInfo } from "../../hooks/useUser"
import { useRequestResetPassword, useRequestRole } from "../../api/auth";
import {
  initialFormData,
  SectionKey,
  sectionKeys,
  formSteps,
  SectionKeyExtra
} from "../../models/formUtils";
import { UpdateUserFormData } from "../../models/user";
import { useAuthContext } from "../../context/auth_context";
import { useGetUserById } from "../../hooks/useUser"
import { a } from "framer-motion/dist/types.d-6pKw1mTI";
import { defaults } from "chart.js";
import { cleanObject } from "../../utils/format";
import AOS from "aos";
import "aos/dist/aos.css";
import { EditCompany } from "../../components/Profile/EditCompany";



const EditProfile = () => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [newProfileImage, setNewProfileImage] = useState<string>("");

  const [showChangeEmail, setShowChangeEmail] = useState<boolean>(false);
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<SectionKeyExtra>("personal")

  const requestResetPassword = useRequestResetPassword()
  const updateUserByIdMutation = useUpdateUserById()
  const updateStudentInfo = useUpdateStudentInfo()
  const requestRole = useRequestRole()
  const uploadFileMutation = useUploadFile();

  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const { userId, isLoading: isLoadingAuth } = useAuthContext()
  const { data: userData, isLoading: isLoadingUser} = useGetUserById(userId, {enabled: !!userId})

  const [formData, setFormData] = useLocalStorage<UpdateUserFormData>(
    "edit-profile",
    initialFormData
  );

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
        return;
    }
      
    try {
      const uploaded = await uploadFileMutation.mutateAsync(file)
      setNewProfileImage(uploaded.url);
      setFormData(prev => ({
        ...prev,
        "profile_picture": uploaded.url
      }))
      setShowConfirmModal(true);
    } catch (error: any) {
      console.error(error)
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
      const { faculty, department, field, student_type } = formData;
      const hasAny = faculty || department || field || student_type;
      const hasAll = faculty && department && field && student_type;
      if (hasAny && !hasAll){
        setError("All Field {faculty, department, field, student type} must be present")
        setIsLoading(false);
        return;
      }
      updateUserByIdMutation.mutate(formData);
      updateStudentInfo.mutate(formData)
      setSuccessMessage(`Your information has been saved.`)
      setShowSuccessModal(true);
      setHasChanges(false);
      setError("")
      setIsLoading(false);
    } catch (err) {
      setError(err)
      setIsLoading(false);
    }
  };

  const handleSubmitResetPassword = async () => {
    try {
      setIsLoading(true);
      requestResetPassword.mutate(userData.contact_info.email,{
        onSuccess(data, variables, context) {
          setReferenceNumber(data["reference_number"])
        },
      })
      setIsLoading(false);
      
    } catch (err) {
      console.error("Password reset error:", err);
      setIsLoading(false);
    }
  };

  const handleSumbitRequestRole = async () => {
    try {
      setIsLoading(true);
      requestRole.mutate()
      setIsLoading(false);
    } catch (err) {
      console.error("Password reset error:", err);
      setIsLoading(false);
    }
  }

  if (!userData || isLoadingAuth || isLoadingUser) {
    return (<div>loading. . .</div>)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-gray-800 p-4 md:p-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="fade-up">
        {/* Header with profile summary */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 py-8 px-6">
          <div className="flex flex-col md:flex-row items-center gap-6" data-aos="fade-right">
            <div className="relative group">
              <img
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg transition-all group-hover:border-blue-200"
                src={userData.profile_picture == "" || userData.profile_picture == undefined ?
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
                <label className="opacity-0 group-hover:opacity-100 cursor-pointer bg-white text-blue-800 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:bg-blue-50 flex items-center gap-2">
                  <IoImage className="text-lg" />
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
            
            <div className="text-center md:text-left text-white" data-aos="fade-left">
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <FaUserEdit className="text-2xl" />
                Edit Your Profile
              </h1>
              <p className="mt-2 text-blue-100">
                {userData.name}
              </p>
              {hasChanges && (
                <p className="text-yellow-200 mt-2 text-sm flex items-center gap-2">
                  <FaUndo className="text-lg" />
                  You have unsaved changes
                </p>
              )}
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex mt-8 border-b border-blue-500 overflow-x-auto no-scrollbar" data-aos="fade-up">
            {sectionKeys.map((section) => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section);
                  setError("");
                }}
                className={`px-6 py-3 text-sm md:text-base font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeSection === section
                    ? "text-white border-b-2 border-white"
                    : "text-blue-200 hover:text-white"
                }`}
              >
                {section === "personal" && <IoPerson />}
                {section === "company" && <IoBusiness />}
                {section === "academic" && <IoBook />}
                {section === "contact" && <IoCall />}
                {section.charAt(0).toUpperCase() + section.slice(1)} Info
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          <div className="grid gap-8">
            {/* Current Section Fields */}
            <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
              { activeSection != "company" &&
                <EditProfileForm
                  error={error}
                  formData={formData}
                  handleChange={handleChange}
                  currentFields={formSteps[activeSection]}
                />
              }
              {activeSection === "company" &&
                <EditCompany
                  setError={setError}
                  error={error}
                  formData={formData}
                />
              }
              <EditProfileAction
                hasChanges={hasChanges}
                isLoading={isLoading}
                onShowRequest={()=>{
                  handleSumbitRequestRole()
                  setSuccessMessage(`Your Role Request Been Send`)
                  setShowSuccessModal(true);
                }}
                onShowChangeEmail={()=>setShowChangeEmail(true)}
                onShowResetPassword={()=>{
                  handleSubmitResetPassword()
                  setShowResetPassword(true);
                }}
                onShowDelete={()=>setShowDeleteModal(true)}
                onShowDiscard={()=>
                  setHasChanges(false)
                }
                onShowSave={()=>{
                  handleSubmit()
                }}
              />
            </div>
          </div>
        </div>
      </div>

      { showChangeEmail && (
        <ChangeEmailModal
          onCancel={()=>setShowChangeEmail(false)}
        />
      )}

      { showResetPassword && (
        <PasswordResetModal
          email={userData.email}
          referenceNumber={referenceNumber}
          onClose={()=>setShowResetPassword(false)}
        />
      )}

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
          // activeSection={activeSection}
          successMessage={successMessage}
          onDone={()=>setShowSuccessModal(false)}
        />
      )}
    </div>
  );
}
export default EditProfile
