import { UserCredentials } from "./user";

export interface OTR {
  email: string;
}

export interface AlumniRegistration extends UserCredentials {
  token: string;
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

export interface RequestOTRFormProps {
  formData: OTR;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
}

export interface RegisterCPEFormProps {
  formData: AlumniRegistrationFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  passwordStrength: PasswordStrength;
  confirmPasted: boolean;
  confirmPasswordRef: React.RefObject<HTMLInputElement>;
}
