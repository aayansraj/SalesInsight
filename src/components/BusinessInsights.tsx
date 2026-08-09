import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Armchair,
  MapPin,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Lightbulb,
  Filter,
} from 'lucide-react';
import { BUSINESS_INSIGHTS } from '../data/salesData';
import { BusinessInsight } from '../types';

const ICON_MAP: { [key: string]: any } = {
  TrendingUp,
  Armchair,
  MapPin,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
};

interface BusinessInsightsProps {
  insights?: BusinessInsight[];
}

export const BusinessInsights: React.FC<BusinessInsightsProps> = ({ insights }) => {
  const activeInsights = insights && insights.length > 0 ? insights : BUSINESS_INSIGHTS;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(activeInsights.map((i) => i.category)))];

  const filteredInsights =
    selectedCategory === 'all'
      ? activeInsights
      : activeInsights.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 relative overflow-hidden">
        <div className="absolute right-4 top-4 h-32 w-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Executive Business Insights & Strategic Recommendations
            </h2>
            <p className="text-xs text-slate-400">
              Data-backed findings dynamically derived from active sales dataset
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-medium flex items-center space-x-1 mr-2">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? `All Insights (${activeInsights.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInsights.map((insight) => {
          const Icon = ICON_MAP[insight.iconName] || Lightbulb;
          const isCritical = insight.impactLevel === 'Critical';
          const isHigh = insight.impactLevel === 'High';

          return (
            <div
              key={insight.id}
              className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between relative group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-blue-400 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isCritical
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : isHigh
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {insight.impactLevel} Impact
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-blue-400 tracking-wide uppercase">
                  {insight.category}
                </span>

                <h3 className="text-base font-bold text-white tracking-tight mt-1 mb-2 leading-snug">
                  {insight.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {insight.summary}
                </p>

                {/* Key Metric Data Box */}
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 mb-4">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Data Metric Benchmark
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400">
                    {insight.dataPoint}
                  </span>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="pt-3 border-t border-slate-800/60">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 mb-1">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Strategic Recommendation:</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {insight.recommendation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
