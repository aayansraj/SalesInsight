import React, { useState } from 'react';
import {
  TrendingUp,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Database,
  AlertCircle,
  UserPlus,
  LogIn,
  UserCheck,
  Key,
} from 'lucide-react';
import {
  validateCredentials,
  registerNewUserAccount,
  getRegisteredUsers,
  UserAccount,
} from '../data/userRegistry';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; role: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('analyst@salesinsight.com');
  const [loginPassword, setLoginPassword] = useState('analyst123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'Data Analyst' | 'Executive' | 'Regional Manager' | 'Administrator'>('Data Analyst');

  // Alert message state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const registeredUsers = getRegisteredUsers();

  // Fill credentials helper
  const fillCredentials = (acc: UserAccount) => {
    setLoginEmail(acc.email);
    setLoginPassword(acc.passwordHash);
    setAuthMode('login');
    setErrorMessage(null);
    setSuccessMessage(`Loaded credentials for ${acc.name} (${acc.role})`);
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = validateCredentials(loginEmail, loginPassword);

    if (!result.success || !result.user) {
      setErrorMessage(result.message || 'Invalid email or password!');
      return;
    }

    onLogin({
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    });
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in all required fields!');
      return;
    }

    const result = registerNewUserAccount(regName, regEmail, regPassword, regRole);

    if (!result.success || !result.user) {
      setErrorMessage(result.message || 'Registration failed!');
      return;
    }

    setSuccessMessage('Account registered successfully in user database! Logging you in...');
    setTimeout(() => {
      onLogin({
        name: result.user!.name,
        email: result.user!.email,
        role: result.user!.role,
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 glass-panel rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden z-10">
        {/* Left Panel: Platform Intro & Registered Database Accounts */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/40 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20">
                <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  SalesInsight
                </span>
                <p className="text-xs text-blue-400 font-medium">Database Authentication System</p>
              </div>
            </div>

            <h1 className="text-xl font-extrabold text-white leading-tight mb-2">
              Strict User Account Registry
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Only authenticated user accounts registered in the database can access the dashboard.
            </p>

            {/* Saved Database Accounts List */}
            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center space-x-1">
                <Key className="h-3.5 w-3.5 text-amber-400" />
                <span>Saved Database Accounts (Click to Auto-fill):</span>
              </span>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {registeredUsers.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => fillCredentials(acc)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-blue-900/30 border border-slate-800 hover:border-blue-500/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white group-hover:text-blue-300">
                          {acc.name}
                        </span>
                        <span className="px-1.5 py-0.2 text-[9px] font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {acc.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {acc.email} | Pass: {acc.passwordHash}
                      </span>
                    </div>
                    <UserCheck className="h-4 w-4 text-slate-500 group-hover:text-blue-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Database Auth Status: Active</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Strict DB Validation</span>
            </span>
          </div>
        </div>

        {/* Right Panel: Sign In or Register Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between bg-slate-900/90">
          <div>
            {/* Mode Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
                  authMode === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
                  authMode === 'register' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Register Account</span>
              </button>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start space-x-2">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Mode 1: Sign In */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. analyst@salesinsight.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="Enter account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 mt-2"
                >
                  <span>Authenticate & Open Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* Mode 2: Register New Account */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shubham Verma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. shubham@salesinsight.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Create Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Set account password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assign User Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Data Analyst">Data Analyst / Intern</option>
                    <option value="Executive">Executive VP</option>
                    <option value="Regional Manager">Regional Manager</option>
                    <option value="Administrator">System Administrator</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 mt-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register & Save to Database</span>
                </button>
              </form>
            )}
          </div>

          <p className="text-[10px] text-slate-500 text-center mt-6">
            Database Account Authentication • SalesInsight v1.0
          </p>
        </div>
      </div>
    </div>
  );
};
