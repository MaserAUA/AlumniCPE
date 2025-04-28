import { UpdateUserFormData } from "./user";

export interface FormField {
  label: string;
  name: keyof UpdateUserFormData;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  required: boolean;
  disabled?: boolean;
  options?: string[];
}

export interface RegisterStepProps {
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  isLoading: boolean;
  error: string;
  currentFields: FormField[];
}
