"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@/lib/types';
import { DEFAULT_AVATAR, normalizeAvatar } from '@/lib/avatar';
import { getItem, setItem, removeItem } from '@/lib/localStorage';
import { useRouter, usePathname } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  BUILTIN_ADMIN_EMAIL,
  BUILTIN_ADMIN_PASSWORD,
} from '@/lib/adminCredentials';

export type LoginResult = { success: true } | { success: false; error: string };

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  login: (email: string, password?: string) => Promise<LoginResult>;
  logout: () => void;
  isLoading: boolean;
}

function normalizeLoginEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isAdminEmail(email: string): boolean {
  const fromEnv = normalizeLoginEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL || '');
  return email === BUILTIN_ADMIN_EMAIL || (fromEnv.length > 0 && email === fromEnv);
}

function isAdminPassword(password: string): boolean {
  const fromEnv = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';
  return (
    password === BUILTIN_ADMIN_PASSWORD ||
    (fromEnv.length > 0 && password === fromEnv)
  );
}

function profileFromAuthUser(
  authUser: { id: string; email?: string; created_at?: string; user_metadata?: Record<string, unknown> },
  row?: Record<string, unknown> | null,
): Omit<User, 'password'> {
  if (row) {
    return {
      id: String(row.id),
      name: String(row.name),
      email: String(row.email),
      role: row.role as User['role'],
      team: String(row.team ?? 'Global'),
      avatar: normalizeAvatar(String(row.avatar_color ?? '')),
      createdAt: String(row.created_at ?? new Date().toISOString()),
    };
  }
  const meta = authUser.user_metadata ?? {};
  return {
    id: authUser.id,
    name: String(meta.name ?? authUser.email?.split('@')[0] ?? 'User'),
    email: authUser.email ?? '',
    role: (meta.role as User['role']) || 'user',
    team: String(meta.team ?? 'Global'),
    avatar: normalizeAvatar(
      String(meta.avatar ?? meta.avatarColor ?? ''),
    ),
    createdAt: authUser.created_at ?? new Date().toISOString(),
  };
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
      const stored = session.user as Omit<User, 'password'> & { avatarColor?: string };
      setUser({
        ...stored,
        avatar: normalizeAvatar(stored.avatar ?? stored.avatarColor),
      });
    } else {
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
    setIsLoading(false);
  }, [pathname, router]);

  const login = async (email: string, password?: string): Promise<LoginResult> => {
    const normalizedEmail = normalizeLoginEmail(email);

    if (!password) {
      return { success: false, error: 'Password is required.' };
    }

    // 1. Admin — never call Supabase Auth (avoids 400 in browser console)
    if (isAdminEmail(normalizedEmail)) {
      if (!isAdminPassword(password)) {
        return {
          success: false,
          error: 'Wrong admin password. Default is 9437622297 unless changed in Netlify env.',
        };
      }
      const adminUser: Omit<User, 'password'> = {
        id: 'admin-1',
        name: 'Super Admin',
        email: normalizedEmail,
        role: 'admin',
        team: 'Global',
        avatar: DEFAULT_AVATAR,
        createdAt: new Date().toISOString(),
      };
      const session: Session = { user: adminUser, token: 'mock-admin-token' };
      setItem('ag_session', session);
      setUser(adminUser);
      return { success: true };
    }

    if (!normalizedEmail.includes('@')) {
      return {
        success: false,
        error: 'Use the full email address from admin (e.g. user@example.com), not username only.',
      };
    }

    // 2. Supabase Auth (users created by admin)
    if (isSupabaseConfigured) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (authError) {
          return {
            success: false,
            error: authError.message.includes('Invalid login credentials')
              ? 'Wrong email or password. Use the exact email and password shown when the admin created your account.'
              : authError.message,
          };
        }

        if (authData.user) {
          const { data: foundUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          const userObj = profileFromAuthUser(authData.user, foundUser);
          const session: Session = {
            user: userObj,
            token: authData.session?.access_token || `supabase-token-${userObj.id}`,
          };
          setItem('ag_session', session);
          setUser(userObj);
          return { success: true };
        }
      } catch (err) {
        console.error('Failed to log in via Supabase:', err);
        return { success: false, error: 'Could not reach Supabase. Try again later.' };
      }
    }

    // 3. Offline / local users only
    const users = getItem<User[]>('ag_users') || [];
    const foundUser = users.find(
      (u) => normalizeLoginEmail(u.email) === normalizedEmail && u.password === password,
    );

    if (foundUser) {
      const { password: _p, ...userWithoutPassword } = foundUser;
      userWithoutPassword.avatar = normalizeAvatar(
        userWithoutPassword.avatar ??
          (foundUser as User & { avatarColor?: string }).avatarColor,
      );
      const session: Session = { user: userWithoutPassword, token: 'mock-user-token' };
      setItem('ag_session', session);
      setUser(userWithoutPassword);
      return { success: true };
    }

    return {
      success: false,
      error: isSupabaseConfigured
        ? 'Invalid email or password.'
        : 'Supabase is not configured on this site. Contact admin.',
    };
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
