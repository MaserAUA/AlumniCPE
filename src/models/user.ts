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
