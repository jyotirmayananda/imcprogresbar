"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DailyReport } from '@/lib/types';
import { getItem, setItem } from '@/lib/localStorage';
import { mockUsers, generateMockReports } from '@/lib/mockData';

interface DataContextType {
  users: User[];
  reports: DailyReport[];
  addUser: (user: User) => void;
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
    // Load initial data
    let loadedUsers = getItem<User[]>('ag_users');
    let loadedReports = getItem<DailyReport[]>('ag_reports');

    if (!loadedUsers || loadedUsers.length === 0 || loadedUsers.some(u => u.name === 'Alex Sterling')) {
      loadedUsers = mockUsers;
      setItem('ag_users', loadedUsers);
      
      // Force refresh reports too to ensure consistency
      loadedReports = generateMockReports();
      setItem('ag_reports', loadedReports);
    }
    
    // Only force regenerate if we don't have enough data (less than 300 days worth of reports)
    if (!loadedReports || loadedReports.length < 300) {
      loadedReports = generateMockReports();
      setItem('ag_reports', loadedReports);
    }

    setUsers(loadedUsers);
    setReports(loadedReports);
  }, []);

  const addUser = (user: User) => {
    const newUsers = [...users, user];
    setUsers(newUsers);
    setItem('ag_users', newUsers);
  };

  const addReport = (report: DailyReport) => {
    const newReports = [...reports, report];
    setReports(newReports);
    setItem('ag_reports', newReports);
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
    <DataContext.Provider value={{ users, reports, addUser, addReport, getReports, getTeamStats, hasSubmittedToday }}>
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
