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
import { Award, Layers } from 'lucide-react';
import { SalesRecord } from '../types';

interface TopProductsChartProps {
  data: SalesRecord[];
}

const CATEGORY_COLORS: { [key: string]: string } = {
  Furniture: '#3b82f6',
  Electronics: '#10b981',
  Clothing: '#f59e0b',
  'Home Appliances': '#8b5cf6',
  'Office Supplies': '#ec4899',
};

export const TopProductsChart: React.FC<TopProductsChartProps> = ({ data }) => {
  // Product breakdown
  const prodMap: { [key: string]: { name: string; sales: number; qty: number; category: string } } = {};

  data.forEach((item) => {
    const prod = item.Product_Name;
    if (!prodMap[prod]) {
      prodMap[prod] = { name: prod, sales: 0, qty: 0, category: item.Category };
    }
    prodMap[prod].sales += item.Total_Sales;
    prodMap[prod].qty += item.Quantity;
  });

  const topProducts = Object.values(prodMap)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 8);

  // Category breakdown
  const catMap: { [key: string]: { name: string; sales: number } } = {};
  data.forEach((item) => {
    const cat = item.Category;
    if (!catMap[cat]) catMap[cat] = { name: cat, sales: 0 };
    catMap[cat].sales += item.Total_Sales;
  });

  const categoryData = Object.values(catMap).sort((a, b) => b.sales - a.sales);
  const totalCatSales = categoryData.reduce((acc, c) => acc + c.sales, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-white mb-0.5">{d.name}</p>
          <p className="text-xs text-slate-400 mb-1">Category: {d.category}</p>
          <p className="text-sm font-extrabold text-teal-400">
            Revenue: ${Math.round(d.sales).toLocaleString()}
          </p>
          <p className="text-xs text-slate-300">Units Sold: {d.qty}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Top 8 Products Horizontal Bar Chart */}
      <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800/80">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="h-5 w-5 text-teal-400" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Top 8 Revenue Generating Products
            </h3>
            <p className="text-xs text-slate-400">
              Leather Sofa & Standing Desk generate highest financial yield
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topProducts}
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
              <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#0d9488" radius={[0, 6, 6, 0]}>
                {topProducts.map((entry, index) => (
                  <Cell key={`prod-cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#0d9488'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Revenue Distribution */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center space-x-2 mb-2">
          <Layers className="h-5 w-5 text-pink-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Category Share
          </h3>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="sales"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cat-cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#3b82f6'} />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => `$${Math.round(val).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 mt-2 pt-3 border-t border-slate-800/60">
          {categoryData.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#3b82f6' }}
                />
                <span className="text-slate-300 font-medium">{cat.name}</span>
              </div>
              <span className="text-slate-400 font-bold">
                {((cat.sales / totalCatSales) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
