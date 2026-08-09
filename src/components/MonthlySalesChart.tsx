import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, BarChart2, Calendar } from 'lucide-react';
import { SalesRecord } from '../types';

interface MonthlySalesChartProps {
  data: SalesRecord[];
}

export const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Aggregate by YearMonth
  const monthlyMap: { [key: string]: { month: string; sales: number; orders: number } } = {};

  data.forEach((item) => {
    const month = item.Order_Date.substring(0, 7); // YYYY-MM
    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, sales: 0, orders: 0 };
    }
    monthlyMap[month].sales += item.Total_Sales;
    monthlyMap[month].orders += 1;
  });

  const chartData = Object.keys(monthlyMap)
    .sort()
    .map((m) => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const parts = m.split('-');
      const monthIndex = parseInt(parts[1], 10) - 1;
      const formattedMonth = `${monthNames[monthIndex]} ${parts[0]}`;
      return {
        monthKey: m,
        month: formattedMonth,
        sales: Math.round(monthlyMap[m].sales),
        orders: monthlyMap[m].orders,
      };
    });

  const peakMonth = [...chartData].sort((a, b) => b.sales - a.sales)[0];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-slate-200 mb-1">{label}</p>
          <p className="text-sm font-extrabold text-blue-400">
            Sales: ${payload[0].value.toLocaleString()}
          </p>
          {payload[1] && (
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">
              Orders: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Monthly Revenue Trend & Volume
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            2024 Revenue trajectory showing peak surge in Q4 holiday season
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {peakMonth && (
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Peak: {peakMonth.month} (${peakMonth.sales.toLocaleString()})</span>
            </div>
          )}

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center space-x-1 ${
                chartType === 'area' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Area</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center space-x-1 ${
                chartType === 'bar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Bar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
