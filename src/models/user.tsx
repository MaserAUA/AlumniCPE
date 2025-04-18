// models/user.tsx

// Base interface for username and password
export interface UserCredentials {
  username: string;
  password: string;
}

// User Registration Form (extending UserCredentials)
export interface UserRegistryForm extends UserCredentials {
  email: string; // Adding email for user registration
}

// User Login Form (extending UserCredentials)
export interface UserLoginForm extends UserCredentials {}

export interface UserById {
   user_id: string;
  // username: string;
  // email: string;
}

export interface UserByFilter {
    user_id: string;
}

export interface UserByFulltextSearch {
    searchText: string;
}

export interface UserThatAssociateWith {

}

export interface FriendOfaFriendOfUser {

}

export interface CreateProfile {
   generation: string;
   first_name: string;
   student_id: string;
   role: string;
}

export interface UpdateUserById {
  user_id: string;
  student_info: {
    "gpax": 3.60,
    "admit_year": 2535,
    "graduate_year": 2539
}
}

export interface DeleteUserById {
  user_id: string;
}

export interface UserFriendById {
  user_id: string;
}

export interface AddFriend {
  user_id: string;
}

export interface Unfriend {
  user_id: string;
}

export interface AddStudentInfo {
  user_id: string;
  faculty: string;
  department: string;
  field: string;
  studentType: string;
}

export interface UpdateStudentInfo {
  user_id: string;
  faculty: string;
  department: string;
  field: string;
  studentType: string;  
}

export interface RemoveStudentInfo {
  user_id: string;
}

export interface AddUserCompany {
  user_id: string;
  companies: {
    "name": string,
    "address": string,
    "position": string,
  }
}

export interface UpdateUserCompany {
 position: string;
 user_id: string;
 company_id: string;
}

export interface DeleteUserCompany {
 user_id: string;
 company_id: string;
}