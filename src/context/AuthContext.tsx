"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@/lib/types';
import { getItem, setItem, removeItem } from '@/lib/localStorage';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing session
    const session = getItem<Session>('ag_session');
    if (session && session.user) {
      setUser(session.user);
    } else {
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
    setIsLoading(false);
  }, [pathname, router]);

  const login = async (email: string, password?: string) => {
    // Hardcoded admin
    if (email === 'admin' && password === 'admin123') {
      const adminUser: Omit<User, 'password'> = {
        id: 'admin-1',
        name: 'Super Admin',
        email: 'admin',
        role: 'admin',
        team: 'Global',
        avatarColor: '#22C55E',
        createdAt: new Date().toISOString()
      };
      const session: Session = { user: adminUser, token: 'mock-admin-token' };
      setItem('ag_session', session);
      setUser(adminUser);
      return true;
    }

    // Check users
    const users = getItem<User[]>('ag_users') || [];
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _p, ...userWithoutPassword } = foundUser;
      const session: Session = { user: userWithoutPassword, token: 'mock-user-token' };
      setItem('ag_session', session);
      setUser(userWithoutPassword);
      return true;
    }

    return false;
  };

  const logout = () => {
    removeItem('ag_session');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
