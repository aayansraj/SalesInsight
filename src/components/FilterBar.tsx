import React from 'react';
import { Search, Filter, RotateCcw, Calendar, MapPin, Tag, CheckCircle2 } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  regions: string[];
  categories: string[];
  statuses: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  onReset,
  regions,
  categories,
  statuses,
}) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Product Name, Customer, Order ID..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-wrap">
          {/* Date Range */}
          <div className="relative">
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value as any }))}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none pr-8"
            >
              <option value="all">📅 All Time (2024)</option>
              <option value="q1">Q1 (Jan - Mar)</option>
              <option value="q2">Q2 (Apr - Jun)</option>
              <option value="q3">Q3 (Jul - Sep)</option>
              <option value="q4">Q4 (Oct - Dec)</option>
            </select>
          </div>

          {/* Region */}
          <div className="relative">
            <select
              value={filters.region}
              onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              <option value="all">📍 All Regions</option>
              {regions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg} Region
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              <option value="all">🏷️ All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Order Status */}
          <div className="relative">
            <select
              value={filters.orderStatus}
              onChange={(e) => setFilters((prev) => ({ ...prev, orderStatus: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              <option value="all">⚡ All Order Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 transition-all shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};
