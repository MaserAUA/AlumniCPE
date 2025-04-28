export interface UpdateUserFormData extends StudentInfo, ContactInfo {
  first_name?: string;
  last_name?: string;
  first_name_eng?: string;
  last_name_eng?: string;
  gender?: string;
  profile_picture?: string;
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
