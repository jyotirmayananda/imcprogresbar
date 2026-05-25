"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@/lib/types';
import { getItem, setItem, removeItem } from '@/lib/localStorage';
import { useRouter, usePathname } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

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
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'ambikaprsahu1105';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '9437622297';

    // 1. Admin check first (dynamically configured via env, with local backup)
    if (email === adminEmail && password === adminPassword) {
      const adminUser: Omit<User, 'password'> = {
        id: 'admin-1',
        name: 'Super Admin',
        email: adminEmail,
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

    // 2. Query Supabase if configured
    if (isSupabaseConfigured) {
      try {
        // A. Try official Supabase Auth first
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password: password || '',
        });

        if (authData.user && !authError) {
          // Fetch their custom profile from public.users
          const { data: foundUser, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (foundUser && !dbError) {
            const userObj: Omit<User, 'password'> = {
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              role: foundUser.role as any,
              team: foundUser.team,
              avatarColor: foundUser.avatar_color,
              createdAt: foundUser.created_at
            };

            const session: Session = { user: userObj, token: authData.session?.access_token || 'supabase-token-' + foundUser.id };
            setItem('ag_session', session);
            setUser(userObj);
            return true;
          }
        }

        // B. Fallback: Query the public.users table directly (for legacy/custom accounts)
        const { data: foundUser, error: tableError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .single();

        if (foundUser && !tableError) {
          const userObj: Omit<User, 'password'> = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role as any,
            team: foundUser.team,
            avatarColor: foundUser.avatar_color,
            createdAt: foundUser.created_at
          };

          const session: Session = { user: userObj, token: 'supabase-token-' + foundUser.id };
          setItem('ag_session', session);
          setUser(userObj);
          return true;
        }
      } catch (err) {
        console.error('Failed to log in via Supabase:', err);
      }
    }

    // 3. Fallback: Check local users in localStorage
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
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch((err) => {
        console.error('Failed to sign out from Supabase Auth:', err);
      });
    }
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
