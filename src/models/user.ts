// models/user.tsx
import { UserCompany } from "./company";

// Base interface for username and password
export interface UserCredentials {
  username: string;
  password: string;
}

// User Registration Form (extending UserCredentials)
export interface UserRegistryForm extends UserCredentials {
  email: string; // Adding email for user registration
}

export interface CollegeInfo {
  faculty?: string;
  department?: string;
  field?: string;
  student_type?: string;
}

export interface StudentInfo {
  student_id?: string;
  generation?: string;
  admit_year?: string;
  graduate_year?: string;
  gpax?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
}

export interface UserLoginForm extends UserCredentials {}

export interface CreateUserFormData extends UserRegistryForm {
  first_name?: string;
  last_name?: string;
  first_name_eng?: string;
  last_name_eng?: string;
  gender?: string;
  profile_picture?: string;
  student_info?: StudentInfo;
  contact_info?: ContactInfo;
}

export interface UpdateUserFormData
  extends StudentInfo,
    ContactInfo,
    CollegeInfo {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  first_name_eng?: string;
  last_name_eng?: string;
  gender?: string;
  profile_picture?: string;
  companies?: UserCompany[];
  role?: "admin" | "user" | "alumnus";
}
