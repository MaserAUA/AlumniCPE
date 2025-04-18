export interface FormData {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
  studentID: string;
  favoriteSubject: string;
  workingCompany: string;
  jobPosition: string;
  lineOfWork: string;
  cpeModel: string;
  salary: string;
  nation: string;
  sex: string;
  president: string;
};

export interface FormField {
  label: string;
  name: keyof FormData;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  required: boolean;
  disabled?: boolean;
  options?: string[];
};

export interface RegisterStepProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isLoading: boolean;
  error: string;
  currentFields: FormField[];
};
