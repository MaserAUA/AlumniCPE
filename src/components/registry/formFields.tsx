import React from "react";
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
import { FormField } from "../../models/registry";

export const formSteps: FormField[][] = [
    // Step 1: Personal Information
    [
      { 
        label: "First name", 
        name: "firstName", 
        type: "text", 
        placeholder: "Enter your first name", 
        icon: <FaUser className="text-blue-400" />,
        required: true,
      },
      { 
        label: "Last name", 
        name: "lastName", 
        type: "text", 
        placeholder: "Enter your last name", 
        icon: <FaUser className="text-blue-400" />,
        required: true,
      },
      { 
        label: "Email", 
        name: "email", 
        type: "email", 
        placeholder: "your.email@example.com", 
        icon: <FaEnvelope className="text-blue-400" />,
        required: true,
        disabled: true, // Email should be read-only since it comes from RegisterCPE
      },
      { 
        label: "Password", 
        name: "password", 
        type: "password", 
        placeholder: "Create a secure password", 
        icon: <FaLock className="text-blue-400" />,
        required: true,
        disabled: true, // Password should be read-only since it comes from RegisterCPE
      },
      { 
        label: "Phone Number", 
        name: "phoneNumber", 
        type: "tel", 
        placeholder: "Enter your phone number", 
        icon: <FaPhone className="text-blue-400" />,
        required: true,
      },
      {
        label: "Sex",
        name: "sex",
        type: "select",
        placeholder: "Male/Femal",
        options: ["Select", "Male", "Female", "Prefer not to say"],
        icon: <FaUser className="text-blue-400" />,
        required: true,
      },
    ],
    // Step 2: Educational Information
    [
      { 
        label: "Student ID",
        name: "studentID",
        type: "text",
        placeholder: "Enter your student ID",
        icon: <FaIdCard className="text-blue-400" />,
        required: true,
      },
      { 
        label: "CPE Model",
        name: "cpeModel",
        type: "text",
        placeholder: "e.g., CPE35",
        icon: <FaIdCard className="text-blue-400" />,
        required: true,
      },
      { 
        label: "Favorite subject",
        name: "favoriteSubject",
        type: "text",
        placeholder: "What subject do you enjoy most?", 
        icon: <FaBook className="text-blue-400" />,
        required: false,
      },
      { 
        label: "Nation",
        name: "nation",
        type: "text",
        placeholder: "Your nationality",
        icon: <BsGlobe className="text-blue-400" />,
        required: true,
      },
      {
        label: "President?",
        name: "president",
        type: "select",
        placeholder: "Select",
        options: ["Select", "Yes", "No"],
        icon: <FaUser className="text-blue-400" />,
        required: true,
      },
    ],
    // Step 3: Professional Information
    [
      { 
        label: "Working company",
        name: "workingCompany",
        type: "text",
        placeholder: "Current or previous company",
        icon: <BsBuilding className="text-blue-400" />,
        required: false,
      },
      { 
        label: "Job position",
        name: "jobPosition",
        type: "text",
        placeholder: "Your job title",
        icon: <BsBriefcase className="text-blue-400" />,
        required: false,
      },
      { 
        label: "Line of work",
        name: "lineOfWork",
        type: "text",
        placeholder: "Field or industry",
        icon: <BsBriefcase className="text-blue-400" />,
        required: false,
      },
      { 
        label: "Salary",
        name: "salary",
        type: "text",
        placeholder: "Your current salary (optional)",
        icon: <BsCurrencyDollar className="text-blue-400" />,
        required: false,
      },
    ]
  ];
