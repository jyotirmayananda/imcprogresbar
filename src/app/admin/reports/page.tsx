"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, ChevronDown, Package, IndianRupee, MapPin } from "lucide-react";

export default function AdminReports() {
  const { users, getReports } = useData();
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "2023-01-01", end: new Date().toISOString().split("T")[0] });
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const reports = getReports(selectedUser === "all" ? undefined : selectedUser, dateRange);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Daily Reports</h1>
          <p className="text-slate-500 mt-1">Review team submissions and history.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-500" />
            <select 
              value={selectedUser} 
              onChange={e => setSelectedUser(e.target.value)}
              className="bg-transparent text-slate-900 focus:outline-none [&>option]:bg-slate-50 text-sm"
            >
              <option value="all">All Members</option>
              {users.filter(u => u.role === 'user').map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input 
              type="date" 
              value={dateRange.start} 
              onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-transparent text-slate-900 text-sm focus:outline-none [color-scheme:light]"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="date" 
              value={dateRange.end} 
              onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-transparent text-slate-900 text-sm focus:outline-none [color-scheme:light]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {reports.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center text-slate-500">
            No reports found for the selected filters.
          </div>
        ) : (
          reports.map(report => {
            const u = users.find(u => u.id === report.userId);
            const isExpanded = expandedReport === report.id;
            
            return (
              <motion.div 
                key={report.id} 
                layout
                className="glass rounded-2xl overflow-hidden border border-slate-200"
              >
                <div 
                  className="p-4 sm:p-6 cursor-pointer hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-slate-900 font-bold"
                      style={{ backgroundColor: u?.avatarColor || '#22C55E' }}
                    >
                      {u?.name.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-slate-900">{u?.name || 'Unknown User'}</h3>
                      <p className="text-slate-500 text-sm">
                        {new Date(report.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="mx-2">•</span>
                        {report.startTime} - {report.endTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 self-start sm:self-center ml-16 sm:ml-0">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Revenue</span>
                      <span className="font-bold text-ag-mint" style={{ color: '#00F5D4' }}>₹{report.totalSalesValue.toLocaleString()}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-200 bg-black/20"
                    >
                      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-4">
                          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Metrics</h4>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                              <span className="text-sm text-slate-600 flex items-center gap-2"><Package className="w-4 h-4 text-ag-green"/> Products</span>
                              <span className="font-bold">{report.productsSold}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                              <span className="text-sm text-slate-600 flex items-center gap-2"><MapPin className="w-4 h-4 text-ag-mint"/> Locations</span>
                              <span className="font-bold">{report.locationsVisited.length}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 flex flex-col gap-4">
                          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Details</h4>
                          {report.dealsClosed && (
                            <div className="bg-ag-mint/10 border border-ag-mint/20 p-3 rounded-lg text-sm">
                              <strong className="text-ag-mint" style={{ color: '#00F5D4' }}>Deal Closed: </strong> 
                              <span className="text-slate-900">{report.dealsDetails}</span>
                            </div>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg">
                              <span className="text-xs text-slate-400 block mb-1">Locations</span>
                              <p className="text-sm text-slate-600">{report.locationsVisited.join(', ') || 'None'}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                              <span className="text-xs text-slate-400 block mb-1">Challenges</span>
                              <p className="text-sm text-slate-600">{report.challenges || 'None reported'}</p>
                            </div>
                          </div>
                          {report.notes && (
                            <div className="bg-white p-3 rounded-lg">
                              <span className="text-xs text-slate-400 block mb-1">Notes</span>
                              <p className="text-sm text-slate-600">{report.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  );
}
