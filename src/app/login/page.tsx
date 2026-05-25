"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(email, password);
    if (result.success) {
      window.location.href = "/";
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl glass-card flex flex-col gap-6"
      >
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold text-slate-900 mb-2">
            IMC <span className="text-ag-green">Team Progress</span>
          </h1>
          <p className="text-slate-500">Sales Team Management</p>
          <p className="text-xs text-slate-400 mt-2">
            Admin: sahuambika05@gmail.com — sales reps use the email from their admin.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Login email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green transition-colors"
              placeholder="rep@company.com"
              autoComplete="email"
              required
            />
            <p className="text-xs text-slate-500">
              Use the email your admin gave you (not username only).
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600 flex justify-between items-center">
              Password
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-xs text-ag-green flex items-center gap-1"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3 h-3" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" /> Show
                  </>
                )}
              </button>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 font-mono focus:outline-none focus:border-ag-green transition-colors"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 bg-ag-green hover:bg-ag-green/80 text-slate-900 font-semibold py-3 rounded-lg transition-colors flex justify-center items-center h-12 disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
