"use client";

import { useState, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { AnimatedCounter } from "@/components/admin/AnimatedCounter";
import { BarChart, LineChart, PieChart } from "@/components/charts/Charts";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Package, IndianRupee, Clock, Trophy } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { users, getReports, getTeamStats, hasSubmittedToday } = useData();
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "2023-01-01", end: new Date().toISOString().split("T")[0] });

  // Compute stats
  const stats = useMemo(() => getTeamStats(selectedUser, dateRange), [getTeamStats, selectedUser, dateRange]);
  const reports = useMemo(() => getReports(selectedUser === "all" ? undefined : selectedUser, dateRange), [getReports, selectedUser, dateRange]);
  const today = new Date().toISOString().split("T")[0];

  // Prepare chart data
  const barData = useMemo(() => {
    const daily: Record<string, number> = {};
    reports.forEach(r => {
      daily[r.date] = (daily[r.date] || 0) + r.productsSold;
    });
    return Object.entries(daily).map(([date, products]) => ({ date, products })).sort((a, b) => a.date.localeCompare(b.date));
  }, [reports]);

  const lineData = useMemo(() => {
    const daily: Record<string, number> = {};
    reports.forEach(r => {
      daily[r.date] = (daily[r.date] || 0) + r.totalSalesValue;
    });
    return Object.entries(daily).map(([date, sales]) => ({ date, sales })).sort((a, b) => a.date.localeCompare(b.date));
  }, [reports]);

  const pieData = useMemo(() => {
    const userSales: Record<string, number> = {};
    reports.forEach(r => {
      const u = users.find(u => u.id === r.userId);
      const name = u ? u.name : 'Unknown';
      userSales[name] = (userSales[name] || 0) + r.totalSalesValue;
    });
    return Object.entries(userSales).map(([name, sales]) => ({ name, sales }));
  }, [reports, users]);

  const [activePreset, setActivePreset] = useState<number | null>(null);

  // Handle preset filters
  const setPreset = (days: number) => {
    setActivePreset(days);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setDateRange({
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0]
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Live team performance and daily status.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* User Selector */}
          <div className="glass p-2 rounded-xl flex items-center px-3">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="bg-transparent text-slate-900 text-sm focus:outline-none outline-none appearance-none cursor-pointer"
            >
              <option value="all" className="bg-white text-slate-900">All Team Members</option>
              {users.filter(u => u.role === 'user').map(u => (
                <option key={u.id} value={u.id} className="bg-white text-slate-900">{u.name}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row gap-3 glass p-2 rounded-xl">
            <div className="flex items-center gap-2 px-2">
              <input 
                type="date" 
                value={dateRange.start} 
                onChange={(e) => { setActivePreset(null); setDateRange(prev => ({ ...prev, start: e.target.value })); }}
                className="bg-transparent text-slate-900 text-sm focus:outline-none [color-scheme:light]"
              />
              <span className="text-slate-400">-</span>
              <input 
                type="date" 
                value={dateRange.end} 
                onChange={(e) => { setActivePreset(null); setDateRange(prev => ({ ...prev, end: e.target.value })); }}
                className="bg-transparent text-slate-900 text-sm focus:outline-none [color-scheme:light]"
              />
            </div>
            <div className="h-full w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex gap-1">
              <button onClick={() => setPreset(0)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${activePreset === 0 ? 'bg-slate-300 text-slate-900' : 'hover:bg-slate-200 text-slate-600'}`}>1D</button>
              <button onClick={() => setPreset(7)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${activePreset === 7 ? 'bg-slate-300 text-slate-900' : 'hover:bg-slate-200 text-slate-600'}`}>7D</button>
              <button onClick={() => setPreset(30)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${activePreset === 30 ? 'bg-slate-300 text-slate-900' : 'hover:bg-slate-200 text-slate-600'}`}>1M</button>
              <button onClick={() => setPreset(365)} className={`px-3 py-1 text-xs rounded-lg transition-colors ${activePreset === 365 ? 'bg-slate-300 text-slate-900' : 'hover:bg-slate-200 text-slate-600'}`}>1Y</button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-ag-mint/10">
            <Package className="w-24 h-24" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Products Sold</p>
          <h2 className="text-4xl font-bold font-heading text-slate-900">
            <AnimatedCounter value={stats.totalProducts} />
          </h2>
        </motion.div>
        
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-ag-green/10">
            <IndianRupee className="w-24 h-24" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Revenue (₹)</p>
          <h2 className="text-4xl font-bold font-heading text-slate-900">
            <AnimatedCounter value={stats.totalRevenue} prefix="₹" />
          </h2>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-blue-400/10">
            <Clock className="w-24 h-24" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Avg Work Hours</p>
          <h2 className="text-4xl font-bold font-heading text-slate-900">
            <AnimatedCounter value={Number(stats.avgWorkHours)} suffix="h" />
          </h2>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-yellow-400/10">
            <Trophy className="w-24 h-24" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Top Performer</p>
          <h2 className="text-2xl font-bold font-heading text-slate-900 mt-2 truncate">
            {stats.topPerformer}
          </h2>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl lg:col-span-2">
          <h3 className="font-heading font-bold text-lg mb-6 text-ag-mint" style={{ color: '#00F5D4' }}>Sales Trend Over Time</h3>
          <LineChart data={lineData} xKey="date" yKey="sales" color="#00F5D4" />
        </motion.div>
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl">
          <h3 className="font-heading font-bold text-lg mb-6 text-ag-green" style={{ color: '#22C55E' }}>Revenue by Member</h3>
          {pieData.length > 0 ? (
             <PieChart data={pieData} nameKey="name" valueKey="sales" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400 pb-12">No data available</div>
          )}
        </motion.div>
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl lg:col-span-3">
          <h3 className="font-heading font-bold text-lg mb-6 text-slate-900">Daily Products Sold</h3>
          <BarChart data={barData} xKey="date" yKey="products" color="#22C55E" />
        </motion.div>
      </motion.div>

      {/* Team Today Overview */}
      <motion.div variants={itemVariants} className="mt-4">
        <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Team Status (Today)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.filter(u => u.role === 'user').map(u => {
            const submitted = hasSubmittedToday(u.id);
            return (
              <Link href={`/admin/reports?user=${u.id}`} key={u.id}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="glass-card p-5 rounded-2xl flex items-center justify-between cursor-pointer border border-slate-200 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-slate-900 font-bold"
                      style={{ backgroundColor: u.avatarColor || '#22C55E' }}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{u.name}</h4>
                      <p className="text-xs text-slate-500">{u.team}</p>
                    </div>
                  </div>
                  {submitted ? (
                    <CheckCircle2 className="w-6 h-6 text-ag-mint" style={{ color: '#00F5D4' }} />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </motion.div>
              </Link>
            );
          })}
          {users.filter(u => u.role === 'user').length === 0 && (
            <p className="text-slate-500 italic">No team members added yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
