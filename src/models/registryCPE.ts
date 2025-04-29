import { UserCredentials } from "./user";

export interface OTR {
  email: string;
}

export interface AlumniRegistration extends UserCredentials {
  token: string;
}

export interface UserRegistration extends UserCredentials {
  email: string;
}

export interface AlumniRegistrationFormData extends AlumniRegistration {
  confirmPassword: string;
}

export interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface PasswordResetFormData extends PasswordFormData {
  token: string;
}
