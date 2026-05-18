"use client";

import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";
import { Calendar, IndianRupee, MapPin, Package, Users } from "lucide-react";

export default function UserHistory() {
  const { user } = useAuth();
  const { getReports } = useData();

  if (!user) return null;

  const reports = getReports(user.id);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="max-w-3xl mx-auto sm:pl-64 pt-6 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900">Report History</h1>
        <p className="text-slate-500 mt-2">Your past daily summaries.</p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>No reports found.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative border-l border-slate-300 ml-4 md:ml-6 pl-6 space-y-8"
        >
          {reports.map((report) => (
            <motion.div key={report.id} variants={itemVariants} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-ag-mint border-4 border-ag-black" style={{ backgroundColor: '#00F5D4' }} />
              
              <div className="glass p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-ag-green font-bold text-lg" style={{ color: '#22C55E' }}>
                    <Calendar className="w-5 h-5" />
                    {new Date(report.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full">
                    {report.startTime} - {report.endTime}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div className="bg-white p-3 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1"><Package className="w-3 h-3"/> Products</span>
                    <span className="font-bold text-lg text-slate-900">{report.productsSold}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1"><IndianRupee className="w-3 h-3"/> Sales</span>
                    <span className="font-bold text-lg text-slate-900">₹{report.totalSalesValue.toLocaleString()}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1"><MapPin className="w-3 h-3"/> Locations</span>
                    <span className="font-bold text-lg text-slate-900">{report.locationsVisited.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl flex flex-col gap-1">
                    <span className="text-slate-500 text-xs flex items-center gap-1"><Users className="w-3 h-3"/> Meetings</span>
                    <span className="font-bold text-lg text-slate-900">{report.customerMeetings}</span>
                  </div>
                </div>

                {(report.challenges || report.notes || report.dealsClosed) && (
                  <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-3 text-sm">
                    {report.dealsClosed && (
                      <div className="text-ag-mint">
                        <span className="font-bold">Deal Closed: </span> {report.dealsDetails}
                      </div>
                    )}
                    {report.challenges && (
                      <div className="text-slate-600">
                        <span className="text-slate-400 block mb-1">Challenges</span>
                        {report.challenges}
                      </div>
                    )}
                    {report.notes && (
                      <div className="text-slate-600">
                        <span className="text-slate-400 block mb-1">Notes</span>
                        {report.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
