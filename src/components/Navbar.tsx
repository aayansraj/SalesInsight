import React from 'react';
import { TrendingUp, Database, Presentation, Sparkles, Download, BarChart3, LogOut, UploadCloud, FileSpreadsheet } from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: string;
}

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExportCSV: () => void;
  recordCount: number;
  user: User | null;
  onLogout: () => void;
  datasetName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onExportCSV,
  recordCount,
  user,
  onLogout,
  datasetName = 'Internship Sales Dataset',
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
    { id: 'upload', label: 'Upload & Process Data', icon: UploadCloud },
    { id: 'insights', label: 'Business Insights', icon: Sparkles },
    { id: 'explorer', label: 'Data Explorer & Audit', icon: Database },
    { id: 'presentation', label: 'Presentation Deck', icon: Presentation },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  SalesInsight
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Sales Analytics & Business Intelligence Dashboard
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden xl:flex items-center space-x-2 text-xs text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <FileSpreadsheet className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-semibold text-white max-w-[120px] truncate">{datasetName}</span>
              <span className="text-[10px] font-bold text-slate-400">({recordCount.toLocaleString()})</span>
            </div>

            <button
              onClick={onExportCSV}
              className="hidden sm:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:text-white"
            >
              <Download className="h-3.5 w-3.5 text-blue-400" />
              <span>Export Clean CSV</span>
            </button>

            {/* User Avatar & Logout */}
            {user && (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="hidden md:block text-right">
                  <span className="block text-xs font-bold text-slate-200">{user.name}</span>
                  <span className="block text-[10px] text-blue-400 font-semibold">{user.role}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out / Switch Account"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-1 px-3 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span>{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
