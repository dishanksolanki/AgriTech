import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storageService';
import { Api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  switchDemoAccount: (userId: string) => void;
  allDemoUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await Api.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to restore user session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const res = await Api.login(email, role);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      const res = await Api.register(userData);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await Api.logout();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = StorageService.updateProfile(user.id, updates);
    setUser(updated);
  };

  const switchDemoAccount = (userId: string) => {
    const users = StorageService.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      StorageService.setCurrentUser(target);
      setUser(target);
      const token = `jwt_simulated_${target.id}_${Date.now()}`;
      localStorage.setItem('agritech_jwt_token', token);
    }
  };

  const allDemoUsers = StorageService.getUsers();

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'farmer',
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        switchDemoAccount,
        allDemoUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
