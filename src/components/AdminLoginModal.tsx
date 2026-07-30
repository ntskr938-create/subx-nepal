import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, LogIn } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin
}) => {
  if (!isOpen) return null;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin' || password === 'subx2026') {
      sessionStorage.setItem('subx_admin_auth', 'true');
      setError('');
      setPassword('');
      onSuccessLogin();
    } else {
      setError('Invalid admin passcode. Please check and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e1420] border border-emerald-500/30 text-white shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-[1.5px] shadow-xl shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0b0f17] rounded-[14px] flex items-center justify-center text-emerald-400">
              <Lock className="w-7 h-7" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">SubX Admin Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Protected Area — Authenticate to manage store orders and catalog
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Admin Access Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter secret admin key..."
                autoFocus
                className="w-full bg-slate-950 border border-white/15 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <LogIn className="w-4 h-4" />
            <span>Unlock Admin Panel</span>
          </button>
        </form>

        {/* Exit Link */}
        <div className="pt-4 border-t border-white/10 flex flex-col items-center justify-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
