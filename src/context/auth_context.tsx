import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  jwt: string | null;
  userId: string | null;
  role: string | null;
  login: (jwt: string, userId: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jwt, setJwt] = useState<string | null>(localStorage.getItem('jwt') || null);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('user_id') || null);
  const [role, setRole] = useState<string | null>(localStorage.getItem('role') || null);

  const login = (jwt: string, userId: string, role: string) => {
    setJwt(jwt);
    setUserId(userId);
    setRole(role);
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setJwt(null);
    setUserId(null);
    setRole(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
  };

  const isAuthenticated = !!jwt;

  useEffect(() => {
    setJwt(localStorage.getItem('jwt'));
    setUserId(localStorage.getItem('user_id'));
    setRole(localStorage.getItem('role'));
  }, []);

  return (
    <AuthContext.Provider value={{ jwt, userId, role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
