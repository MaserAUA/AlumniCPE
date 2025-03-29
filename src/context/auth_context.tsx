import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  jwt: string | null;
  userId: string | null;
  role: string | null;
  setJwt: React.Dispatch<React.SetStateAction<string | null>>;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jwt, setJwt] = useState<string | null>(localStorage.getItem('jwt') || null);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('user_id') || null);
  const [role, setRole] = useState<string | null>(localStorage.getItem('role') || null);
  const isAuthenticated = !!jwt;

  useEffect(() => {
    setJwt(localStorage.getItem('jwt'));
    setUserId(localStorage.getItem('user_id'));
    setRole(localStorage.getItem('role'));
  }, []);

  return (
    <AuthContext.Provider value={{ jwt, role, userId, setJwt, setRole, setUserId, isAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
