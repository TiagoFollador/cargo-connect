import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'shipper' | 'carrier') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('cargoConnectUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('cargoConnectUser');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Find user with matching email
        const user = Object.values(mockUsers).find(u => u.email === email);
        
        if (user && password === 'password') { // Simple demo password check
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('cargoConnectUser', JSON.stringify(user));
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000); // Simulate network delay
    });
  };

  const register = async (name: string, email: string, password: string, role: 'shipper' | 'carrier') => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const existingUser = Object.values(mockUsers).find(u => u.email === email);
        
        if (existingUser) {
          reject(new Error('Email already in use'));
          return;
        }
        
        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          role,
          avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 0,
          transportCount: 0,
          notificationCount: 0
        };
        
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('cargoConnectUser', JSON.stringify(newUser));
        resolve();
      }, 1000); // Simulate network delay
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cargoConnectUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};