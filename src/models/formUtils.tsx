import React from "react";
import { UpdateUserFormData } from "./user"
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaIdCard,
  FaBook,
} from "react-icons/fa";
import {
  BsBriefcase,
  BsBuilding,
  BsCurrencyDollar,
  BsGlobe,
} from "react-icons/bs";

export const sectionKeys: SectionKey[] = [
  "personal",
  "academic",
  "contact",
];

export type SectionKey = "personal" | "academic" | "contact";

export interface FormField {
  label: string;
  name: keyof UpdateUserFormData;
  type: string;
  placeholder: string;
  icon?: React.ReactNode;
  required: boolean;
  disabled?: boolean;
  options?: string[];
}
export const initialFormData = {
    first_name: "",
    last_name: "",
    first_name_eng: "",
    last_name_eng: "",
    gender: "male",
    profile_picture: "",
    student_id: "",
    generation: "",
    admit_year: "",
    graduate_year: "",
    gpax: "",
    phone: "",
    email: "",
    github: "",
    linkedin: "",
    facebook: "",
  }

export const formSteps: Record<SectionKey, FormField[]> = {
  personal: [
    {
      label: "First name",
      name: "first_name",
      type: "text",
      placeholder: "Enter your first name",
      icon: <FaUser className="text-blue-400" />,
      required: true,
    },
    {
      label: "Last name",
      name: "last_name",
      type: "text",
      placeholder: "Enter your last name",
      icon: <FaUser className="text-blue-400" />,
      required: true,
    },
    {
      label: "First name English",
      name: "first_name_eng",
      type: "text",
      placeholder: "Enter your first name",
      icon: <FaUser className="text-blue-400" />,
      required: false,
    },
    {
      label: "Last name",
      name: "last_name_eng",
      type: "text",
      placeholder: "Enter your last name",
      icon: <FaUser className="text-blue-400" />,
      required: false,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "your.email@example.com",
      icon: <FaEnvelope className="text-blue-400" />,
      required: true,
      disabled: true,
    },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      placeholder: "Male/Femal",
      options: ["male", "female", "other"],
      icon: <FaUser className="text-blue-400" />,
      required: true,
    },
  ],
  academic: [
    {
      label: "Student ID",
      name: "student_id",
      type: "text",
      placeholder: "Enter your student ID",
      icon: <FaIdCard className="text-blue-400" />,
      required: true,
    },
    {
      label: "CPE Generation",
      name: "generation",
      type: "text",
      placeholder: "e.g., CPE35",
      icon: <FaIdCard className="text-blue-400" />,
      required: true,
    },
    {
      label: "Admit Year",
      name: "admit_year",
      type: "text",
      placeholder: "Your admited to university year",
      icon: <FaBook className="text-blue-400" />,
      required: false,
    },
    {
      label: "Graduate Year",
      name: "graduate_year",
      type: "text",
      placeholder: "Your graduate year",
      icon: <BsGlobe className="text-blue-400" />,
      required: false,
    },
    {
      label: "GPAX",
      name: "gpax",
      type: "number",
      placeholder: "GPAX",
      icon: <FaUser className="text-blue-400" />,
      required: false,
    },
  ],
  // Step 3: Contact Information
  contact: [
    {
      label: "Phone Number",
      name: "phone",
      type: "tel",
      placeholder: "Enter your phone number",
      icon: <FaPhone className="text-blue-400" />,
      required: false,
    },
    {
      label: "Github",
      name: "github",
      type: "text",
      placeholder: "Enter your github user/profile",
      icon: <FaPhone className="text-blue-400" />,
      required: false,
    },
    {
      label: "Linkedin",
      name: "linkedin",
      type: "text",
      placeholder: "Enter your linkedin user/profile",
      icon: <FaPhone className="text-blue-400" />,
      required: false,
    },
    {
      label: "Facebook",
      name: "facebook",
      type: "text",
      placeholder: "Enter your facebook",
      icon: <FaPhone className="text-blue-400" />,
      required: false,
    },
  ],
};
