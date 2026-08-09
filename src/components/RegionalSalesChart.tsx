import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { MapPin, PieChart as PieIcon } from 'lucide-react';
import { SalesRecord } from '../types';

interface RegionalSalesChartProps {
  data: SalesRecord[];
}

const REGION_COLORS: { [key: string]: string } = {
  West: '#3b82f6',
  Central: '#10b981',
  East: '#8b5cf6',
  South: '#f59e0b',
  North: '#ec4899',
  Unknown: '#64748b',
};

export const RegionalSalesChart: React.FC<RegionalSalesChartProps> = ({ data }) => {
  const regionalMap: { [key: string]: { name: string; sales: number; orders: number } } = {};

  data.forEach((item) => {
    const reg = item.Region || 'Unknown';
    if (!regionalMap[reg]) {
      regionalMap[reg] = { name: reg, sales: 0, orders: 0 };
    }
    regionalMap[reg].sales += item.Total_Sales;
    regionalMap[reg].orders += 1;
  });

  const chartData = Object.values(regionalMap).sort((a, b) => b.sales - a.sales);
  const totalSales = chartData.reduce((acc, curr) => acc + curr.sales, 0);

  const pieData = chartData.map((item) => ({
    name: item.name,
    value: Math.round(item.sales),
    percentage: ((item.sales / totalSales) * 100).toFixed(1),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-white mb-1">{dataItem.name} Region</p>
          <p className="text-sm font-extrabold text-blue-400">
            ${Math.round(dataItem.sales || dataItem.value).toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Share: {(((dataItem.sales || dataItem.value) / totalSales) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bar Chart - Regional Revenue */}
      <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Regional Revenue Breakdown
              </h3>
              <p className="text-xs text-slate-400">
                West and Central regions lead gross market share
              </p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={REGION_COLORS[entry.name] || '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart - Regional Share */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center space-x-2 mb-2">
          <PieIcon className="h-5 w-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Market Share %
          </h3>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={REGION_COLORS[entry.name] || '#3b82f6'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800/60">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2 text-xs">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: REGION_COLORS[item.name] || '#3b82f6' }}
              />
              <span className="text-slate-300 font-medium truncate">{item.name}</span>
              <span className="text-slate-500 font-bold ml-auto">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
