"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";
import { Plus, Users as UsersIcon, Trash2 } from "lucide-react";

export default function AdminUsers() {
  const { users, addUser, deleteUser } = useData();
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    team: "",
    avatarColor: "#22C55E"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'user',
      team: formData.team,
      avatarColor: formData.avatarColor,
      createdAt: new Date().toISOString()
    });
    setFormData({ name: "", email: "", password: "", team: "", avatarColor: "#22C55E" });
    setIsAdding(false);
  };

  const colors = ["#22C55E", "#00F5D4", "#FF6B6B", "#FCA311", "#4D908E", "#9D4EDD"];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-500 mt-1">Manage your sales representatives.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-ag-mint hover:bg-[#00d1b5] text-ag-black font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors"
          style={{ backgroundColor: '#00F5D4', color: '#0A0A0F' }}
        >
          {isAdding ? "Cancel" : <><Plus className="w-5 h-5" /> Add User</>}
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass p-6 rounded-2xl mb-8 overflow-hidden border border-ag-mint/30"
        >
          <h2 className="text-xl font-heading font-bold text-slate-900 mb-4">Create New Sales Rep</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-mint" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">Email (for login)</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="user@example.com" className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-mint" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">Password</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-mint" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">Team / Territory</label>
              <input type="text" value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-mint" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2 mt-2">
              <label className="text-sm text-slate-600">Avatar Color</label>
              <div className="flex gap-3">
                {colors.map(color => (
                  <button 
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, avatarColor: color})}
                    className={`w-8 h-8 rounded-full transition-all ${formData.avatarColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="md:col-span-2 mt-4">
              <button type="submit" className="bg-ag-green hover:bg-ag-green/80 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors">
                Create Account
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.filter(u => u.role === 'user').map(u => (
          <motion.div key={u.id} whileHover={{ y: -5 }} className="glass-card p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl"
                style={{ backgroundColor: u.avatarColor || '#22C55E' }}
              >
                {u.name.charAt(0).toUpperCase()}
              </div>
              <button 
                onClick={() => deleteUser(u.id)}
                className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors" 
                title="Delete User"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">{u.name}</h3>
              <p className="text-slate-500 text-sm">{u.email}</p>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-4 border-t border-slate-200">
              <UsersIcon className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">{u.team}</span>
            </div>
          </motion.div>
        ))}
        {users.filter(u => u.role === 'user').length === 0 && !isAdding && (
          <div className="col-span-full text-center py-12 text-slate-500 glass rounded-2xl">
            No sales reps created yet. Click "Add User" to start.
          </div>
        )}
      </div>
    </div>
  );
}
