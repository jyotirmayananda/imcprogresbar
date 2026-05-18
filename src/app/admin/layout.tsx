"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: FileText },
  ];

  if (!user || user.role !== "admin") {
    return null;
  }

  const NavContent = () => (
    <>
      <h1 className="text-2xl font-heading font-bold text-slate-900 mb-8 px-4 hidden sm:block">IMC <span className="text-ag-green" style={{ color: '#22C55E' }}>Team Progress</span></h1>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.name} 
            href={item.href} 
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${isActive ? 'bg-slate-200' : 'hover:bg-white'}`}
          >
            <item.icon className={`w-5 h-5 ${isActive ? 'text-ag-green' : 'text-slate-500'}`} style={{ color: isActive ? '#22C55E' : undefined }} />
            <span className={`font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="sm:hidden flex justify-between items-center p-4 border-b border-slate-200 glass z-20 relative">
        <h1 className="text-xl font-heading font-bold text-slate-900">IMC <span className="text-ag-green" style={{ color: '#22C55E' }}>Team Progress</span></h1>
        <div className="flex items-center gap-4">
          <button onClick={logout} className="text-slate-500 hover:text-slate-900">
            <LogOut className="w-5 h-5" />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-900">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 top-[73px] bg-slate-50/95 backdrop-blur-xl z-10 p-4 sm:hidden flex flex-col gap-2"
          >
            <NavContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Nav for larger screens */}
      <nav className="hidden sm:flex fixed left-0 top-0 h-full w-64 glass flex-col pt-8 px-4 gap-2 border-r border-slate-200 z-10">
        <NavContent />
        <div className="mt-auto mb-8 px-4">
          <button onClick={logout} className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto sm:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
