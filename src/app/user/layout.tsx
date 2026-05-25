"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { UserAvatar } from "@/components/UserAvatar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/user/dashboard", icon: Home },
    { name: "History", href: "/user/history", icon: History },
  ];

  if (!user || user.role !== "user") {
    return null; // Will redirect in AuthContext or Page
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="flex justify-between items-center p-4 border-b border-slate-200 glass">
        <div className="flex items-center gap-3">
          <UserAvatar avatar={user.avatar} size="sm" />
          <div>
            <h2 className="font-heading font-bold">{user.name}</h2>
            <p className="text-xs text-slate-500">{user.team}</p>
          </div>
        </div>
        <button onClick={logout} className="p-2 text-slate-500 hover:text-slate-900">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 p-4">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full glass border-t border-slate-200 p-4 flex justify-around items-center sm:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 relative">
              <item.icon className={`w-6 h-6 ${isActive ? 'text-ag-Mint' : 'text-slate-500'}`} style={{ color: isActive ? '#00F5D4' : undefined }} />
              <span className={`text-[10px] ${isActive ? 'text-ag-mint' : 'text-slate-500'}`} style={{ color: isActive ? '#00F5D4' : undefined }}>
                {item.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav" 
                  className="absolute -top-4 w-12 h-1 bg-ag-mint rounded-b-full"
                  style={{ backgroundColor: '#00F5D4' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Side Nav for larger screens */}
      <nav className="hidden sm:flex fixed left-0 top-0 h-full w-64 glass flex-col pt-24 px-4 gap-2 border-r border-slate-200">
        <h1 className="text-2xl font-heading font-bold text-slate-900 mb-8 px-4">IMC <span className="text-ag-green">Team Progress</span></h1>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${isActive ? 'bg-slate-200' : 'hover:bg-white'}`}>
              <item.icon className={`w-5 h-5 ${isActive ? 'text-ag-mint' : 'text-slate-500'}`} style={{ color: isActive ? '#00F5D4' : undefined }} />
              <span className={`font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
