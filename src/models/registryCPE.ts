export type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type PasswordStrength = {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
};

export type RegisterCPEFormProps = {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
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
};
