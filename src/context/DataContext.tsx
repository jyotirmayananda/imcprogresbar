"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DailyReport } from '@/lib/types';
import { getItem, setItem } from '@/lib/localStorage';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getAdminFunctionSecret } from '@/lib/adminSecret';
import { toReportPayload } from '@/lib/reportPayload';


interface DataContextType {
  users: User[];
  reports: DailyReport[];
  addUser: (user: User) => void;
  deleteUser: (userId: string) => Promise<void>;
  addReport: (report: DailyReport) => void;
  getReports: (userId?: string, dateRange?: { start: string; end: string }) => DailyReport[];
  getTeamStats: (userId?: string, dateRange?: { start: string; end: string }) => any;
  hasSubmittedToday: (userId: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<DailyReport[]>([]);

  useEffect(() => {
    const loadData = async () => {
      let loadedUsers: User[] = [];
      let loadedReports: DailyReport[] = [];

      if (isSupabaseConfigured) {
        try {
          // Fetch users from Supabase
          const { data: dbUsers, error: uError } = await supabase
            .from('users')
            .select('*');

          if (dbUsers && !uError) {
            loadedUsers = dbUsers.map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role as any,
              team: u.team,
              avatarColor: u.avatar_color,
              createdAt: u.created_at
            }));
          }

          // Fetch reports from Supabase
          const { data: dbReports, error: rError } = await supabase
            .from('reports')
            .select('*');

          if (dbReports && !rError) {
            loadedReports = dbReports.map(r => ({
              id: r.id,
              userId: r.user_id,
              date: r.date,
              productsSold: r.products_sold,
              totalSalesValue: r.total_sales_value,
              startTime: r.start_time,
              endTime: r.end_time,
              locationsVisited: r.locations_visited || [],
              customerMeetings: r.customer_meetings,
              pendingFollowUps: r.pending_follow_ups,
              dealsClosed: r.deals_closed,
              dealsDetails: r.deals_details,
              challenges: r.challenges,
              notes: r.notes,
              createdAt: r.created_at,
              
              // IMC Target fields
              monthTargetLevel: r.month_target_level,
              monthTargetJoining: r.month_target_joining,
              monthTargetTeam: r.month_target_team,
              monthTargetHomeMeeting: r.month_target_home_meeting,
              monthTargetIbm: r.month_target_ibm,
              personalJoiningToday: r.personal_joining_today,
              teamJoiningToday: r.team_joining_today,
              productsSoldList: r.products_sold_list,
              planShowsToday: r.plan_shows_today,
              prospectsListedToday: r.prospects_listed_today,
              phoneShowsToday: r.phone_shows_today,
              meetingPlace: r.meeting_place,
              meetingType: r.meeting_type,
              customersConnected: r.customers_connected,
              associatesConnected: r.associates_connected,
              bookReadToday: r.book_read_today,
              chatWithSurendraVats: r.chat_with_surendra_vats,
              workDoneOnTime: r.work_done_on_time,
              workDoneOnTimeReason: r.work_done_on_time_reason
            }));
          }
        } catch (err) {
          console.error('Failed to load data from Supabase:', err);
        }
      }

      // Fallback to local storage if Supabase is offline/unconfigured or empty
      if (!isSupabaseConfigured || (loadedUsers.length === 0 && loadedReports.length === 0)) {
        let localUsers = getItem<User[]>('ag_users') || [];
        let localReports = getItem<DailyReport[]>('ag_reports') || [];

        // Clear legacy mock accounts
        if (localUsers.some(u => u.id === 'user-1' || u.id === 'user-2' || u.id === 'user-3')) {
          localUsers = [];
          setItem('ag_users', []);
          localReports = [];
          setItem('ag_reports', []);
        }

        loadedUsers = localUsers;
        loadedReports = localReports;
      }

      setUsers(loadedUsers);
      setReports(loadedReports);
    };

    loadData();
  }, []);

  const addUser = async (user: User) => {
    let localUser = { ...user };

    if (isSupabaseConfigured) {
      try {
        // Invoke the Deno Edge Function to securely create the user
        const adminSecret = getAdminFunctionSecret();
        const { data, error } = await supabase.functions.invoke('create-user', {
          body: {
            name: user.name,
            email: user.email,
            password: user.password || 'password123',
            role: user.role,
            team: user.team,
            avatarColor: user.avatarColor
          },
          headers: adminSecret ? { 'x-admin-secret': adminSecret } : undefined,
        });

        if (error) {
          // Fallback: If edge function fails (e.g. not deployed yet), insert directly
          console.warn('Edge function failed or not found, falling back to direct table insert:', error);
          const { error: dbError } = await supabase
            .from('users')
            .insert([{
              id: user.id,
              name: user.name,
              email: user.email,
              password: user.password || 'password123',
              role: user.role,
              team: user.team,
              avatar_color: user.avatarColor,
              created_at: user.createdAt
            }]);
          if (dbError) throw dbError;
        } else if (data && data.success && data.user) {
          console.log('User created successfully via Edge Function:', data.user);
          // Override the local user ID with the real Auth UUID returned from Edge Function
          localUser.id = data.user.id;
        }
      } catch (err: any) {
        console.error('Failed to sync new user to Supabase:', err?.message || err);
      }
    }

    const newUsers = [...users, localUser];
    setUsers(newUsers);
    setItem('ag_users', newUsers);
  };

  const deleteUser = async (userId: string) => {
    // 1. Local update
    const newUsers = users.filter(u => u.id !== userId);
    setUsers(newUsers);
    setItem('ag_users', newUsers);

    // Filter reports locally
    const newReports = reports.filter(r => r.userId !== userId);
    setReports(newReports);
    setItem('ag_reports', newReports);

    // 2. Database delete
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);
        if (error) throw error;
      } catch (err: any) {
        console.error('Failed to delete user from Supabase:', err?.message || err);
      }
    }
  };

  const addReport = async (report: DailyReport) => {
    const newReports = [...reports, report];
    setReports(newReports);
    setItem('ag_reports', newReports);

    if (isSupabaseConfigured) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          const { data, error } = await supabase.functions.invoke('submit-report', {
            body: toReportPayload(report),
          });
          if (error) throw error;
          if (data && !data.success) {
            throw new Error(data.error || 'submit-report failed');
          }
        } else {
          const { error } = await supabase.from('reports').insert([{
            id: report.id,
            user_id: report.userId,
            date: report.date,
            products_sold: report.productsSold,
            total_sales_value: report.totalSalesValue,
            start_time: report.startTime,
            end_time: report.endTime,
            locations_visited: report.locationsVisited,
            customer_meetings: report.customerMeetings,
            pending_follow_ups: report.pendingFollowUps,
            deals_closed: report.dealsClosed,
            deals_details: report.dealsDetails || null,
            challenges: report.challenges || '',
            notes: report.notes || '',
            created_at: report.createdAt,
            month_target_level: report.monthTargetLevel || null,
            month_target_joining: report.monthTargetJoining || 0,
            month_target_team: report.monthTargetTeam || 0,
            month_target_home_meeting: report.monthTargetHomeMeeting || 0,
            month_target_ibm: report.monthTargetIbm || 0,
            personal_joining_today: report.personalJoiningToday || 0,
            team_joining_today: report.teamJoiningToday || 0,
            products_sold_list: report.productsSoldList || '',
            plan_shows_today: report.planShowsToday || 0,
            prospects_listed_today: report.prospectsListedToday || 0,
            phone_shows_today: report.phoneShowsToday || 0,
            meeting_place: report.meetingPlace || null,
            meeting_type: report.meetingType || null,
            customers_connected: report.customersConnected || 0,
            associates_connected: report.associatesConnected || 0,
            book_read_today: report.bookReadToday || '',
            chat_with_surendra_vats: report.chatWithSurendraVats || false,
            work_done_on_time: report.workDoneOnTime || false,
            work_done_on_time_reason: report.workDoneOnTimeReason || '',
          }]);
          if (error) throw error;
        }
      } catch (err: any) {
        console.error('Failed to sync new report to Supabase:', err?.message || err);
      }
    }
  };

  const getReports = (userId?: string, dateRange?: { start: string; end: string }) => {
    let filtered = reports;
    if (userId && userId !== 'all') {
      filtered = filtered.filter(r => r.userId === userId);
    }
    if (dateRange) {
      const start = new Date(dateRange.start).getTime();
      const end = new Date(dateRange.end).getTime();
      filtered = filtered.filter(r => {
        const time = new Date(r.date).getTime();
        return time >= start && time <= end;
      });
    }
    // Sort by date descending
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getTeamStats = (userId?: string, dateRange?: { start: string; end: string }) => {
    const currentReports = getReports(userId === 'all' ? undefined : userId, dateRange);
    
    const totalProducts = currentReports.reduce((sum, r) => sum + r.productsSold, 0);
    const totalRevenue = currentReports.reduce((sum, r) => sum + r.totalSalesValue, 0);
    
    // Average work hours
    let totalMinutes = 0;
    currentReports.forEach(r => {
      const start = new Date(`1970-01-01T${r.startTime}:00Z`);
      const end = new Date(`1970-01-01T${r.endTime}:00Z`);
      let diff = (end.getTime() - start.getTime()) / (1000 * 60);
      if (diff < 0) diff += 24 * 60; // handle crossing midnight
      totalMinutes += diff;
    });
    const avgWorkHours = currentReports.length > 0 ? (totalMinutes / currentReports.length / 60).toFixed(1) : 0;
    
    // Top performer
    const salesByUser: Record<string, number> = {};
    currentReports.forEach(r => {
      salesByUser[r.userId] = (salesByUser[r.userId] || 0) + r.totalSalesValue;
    });
    let topPerformerId = '';
    let maxSales = -1;
    Object.entries(salesByUser).forEach(([uid, sales]) => {
      if (sales > maxSales) {
        maxSales = sales;
        topPerformerId = uid;
      }
    });
    const topPerformer = users.find(u => u.id === topPerformerId)?.name || 'N/A';

    return { totalProducts, totalRevenue, avgWorkHours, topPerformer };
  };

  const hasSubmittedToday = (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return reports.some(r => r.userId === userId && r.date === today);
  };

  return (
    <DataContext.Provider value={{ users, reports, addUser, deleteUser, addReport, getReports, getTeamStats, hasSubmittedToday }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
