"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  const { addReport, hasSubmittedToday } = useData();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    productsSold: "",
    totalSalesValue: "",
    startTime: "",
    endTime: "",
    locationsVisited: "",
    customerMeetings: "",
    pendingFollowUps: "",
    dealsClosed: "no",
    dealsDetails: "",
    challenges: "",
    notes: ""
  });

  const [forceShowForm, setForceShowForm] = useState(false);

  // Check if submitted on load
  const isAlreadySubmitted = user ? hasSubmittedToday(user.id) : false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addReport({
      id: `report-${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      productsSold: Number(formData.productsSold) || 0,
      totalSalesValue: Number(formData.totalSalesValue) || 0,
      startTime: formData.startTime,
      endTime: formData.endTime,
      locationsVisited: formData.locationsVisited.split(",").map(s => s.trim()),
      customerMeetings: Number(formData.customerMeetings) || 0,
      pendingFollowUps: Number(formData.pendingFollowUps) || 0,
      dealsClosed: formData.dealsClosed === "yes",
      dealsDetails: formData.dealsDetails,
      challenges: formData.challenges,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    });

    setSubmitted(true);
    setForceShowForm(false); // Hide the form again after submission
  };

  if ((isAlreadySubmitted || submitted) && !forceShowForm) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] sm:pl-64">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-8 rounded-2xl flex flex-col items-center gap-4 max-w-sm text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-ag-mint" style={{ color: '#00F5D4' }} />
          <h2 className="text-2xl font-heading font-bold text-slate-900">All Set for Today!</h2>
          <p className="text-slate-500">You've successfully submitted your daily report. Great work!</p>
          <button 
            onClick={() => setForceShowForm(true)}
            className="mt-4 bg-ag-green hover:bg-[#16a34a] text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors"
            style={{ backgroundColor: '#22C55E' }}
          >
            + Add Another Report
          </button>
        </motion.div>
      </div>
    );
  }

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
    <div className="max-w-2xl mx-auto sm:pl-64 pt-6 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-slate-900">Daily Report</h1>
        <p className="text-slate-500 mt-2">Fill out your end-of-day summary.</p>
      </div>

      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit} 
        className="flex flex-col gap-6"
      >
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-heading text-xl text-ag-mint" style={{ color: '#00F5D4' }}>Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">Products Sold</label>
              <input type="number" name="productsSold" value={formData.productsSold} onChange={handleChange} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">Total Sales Value (₹)</label>
              <input type="number" name="totalSalesValue" value={formData.totalSalesValue} onChange={handleChange} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-heading text-xl text-ag-mint" style={{ color: '#00F5D4' }}>Time Tracking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green [color-scheme:light]" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green [color-scheme:light]" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-heading text-xl text-ag-mint" style={{ color: '#00F5D4' }}>Activity</h3>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Locations Visited (comma separated)</label>
            <input type="text" name="locationsVisited" value={formData.locationsVisited} onChange={handleChange} placeholder="e.g. Downtown, North Sector" required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">Customer Meetings</label>
              <input type="number" name="customerMeetings" value={formData.customerMeetings} onChange={handleChange} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">Pending Follow-ups</label>
              <input type="number" name="pendingFollowUps" value={formData.pendingFollowUps} onChange={handleChange} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-heading text-xl text-ag-mint" style={{ color: '#00F5D4' }}>Deals & Challenges</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-600">Any deals closed today?</label>
            <select name="dealsClosed" value={formData.dealsClosed} onChange={handleChange} className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green [&>option]:bg-slate-50">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          
          <AnimatePresence>
            {formData.dealsClosed === "yes" && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-col gap-1 overflow-hidden"
              >
                <label className="text-sm text-slate-600">Deal Name / Details</label>
                <input type="text" name="dealsDetails" value={formData.dealsDetails} onChange={handleChange} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-sm text-slate-600">Challenges Faced</label>
            <textarea name="challenges" value={formData.challenges} onChange={handleChange} rows={3} className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green resize-none" placeholder="Any roadblocks?" />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-sm text-slate-600">Additional Notes / Highlights</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green resize-none" placeholder="Any wins to share?" />
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          type="submit"
          className="mt-4 bg-ag-green hover:bg-[#16a34a] text-slate-900 font-bold py-4 rounded-xl transition-colors text-lg"
          style={{ backgroundColor: '#22C55E' }}
        >
          Submit Report
        </motion.button>
      </motion.form>
    </div>
  );
}
