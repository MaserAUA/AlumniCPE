export interface Company {
  company_id?: string;
  company: string;
  address?: string;
}

export interface UserCompany extends Company {
  user_id: string;
  position: string;
  salary_min?: string;
  salary_max?: string;
}
