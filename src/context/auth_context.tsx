import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useVerifyToken } from '../api/auth';

interface AuthContextType {
  userId: string | null;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data, isError, isLoading } = useVerifyToken();
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setUserId(data.user_id);
      setRole(data.user_role);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      setUserId(null);
      setRole(null);
    }
  }, [isError]);

  const isAuthenticated = !!data && !isError;

  return (
    <AuthContext.Provider value={{ role, userId, setRole, setUserId, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
