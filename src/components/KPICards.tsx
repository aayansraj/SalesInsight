import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, PackageCheck, MapPin, Layers, Award } from 'lucide-react';
import { KPIMetrics } from '../types';

interface KPICardsProps {
  metrics: KPIMetrics;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Gross Sales',
      value: `$${metrics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `Completed: $${metrics.completedSales.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: 'from-blue-500 to-indigo-600',
      badge: '+18.4% YoY',
      badgePositive: true,
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toLocaleString(),
      subtitle: 'Across 5 Geographic Regions',
      icon: ShoppingBag,
      color: 'from-indigo-500 to-purple-600',
      badge: '1,450 Trans.',
      badgePositive: true,
    },
    {
      title: 'Average Order Value (AOV)',
      value: `$${metrics.avgOrderValue.toFixed(2)}`,
      subtitle: 'Per Transaction Checkout',
      icon: TrendingUp,
      color: 'from-teal-500 to-emerald-600',
      badge: 'High Value',
      badgePositive: true,
    },
    {
      title: 'Total Units Sold',
      value: metrics.totalUnitsSold.toLocaleString(),
      subtitle: 'Across 25 Product SKUs',
      icon: PackageCheck,
      color: 'from-amber-500 to-orange-600',
      badge: '3,429 Units',
      badgePositive: true,
    },
    {
      title: 'Top Performing Region',
      value: metrics.topRegion.name,
      subtitle: `$${metrics.topRegion.sales.toLocaleString('en-US', { maximumFractionDigits: 0 })} Revenue`,
      icon: MapPin,
      color: 'from-cyan-500 to-blue-600',
      badge: '#1 Market',
      badgePositive: true,
    },
    {
      title: 'Top Product Category',
      value: metrics.topCategory.name,
      subtitle: `$${metrics.topCategory.sales.toLocaleString('en-US', { maximumFractionDigits: 0 })} Sales`,
      icon: Layers,
      color: 'from-rose-500 to-pink-600',
      badge: '38.1% Share',
      badgePositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="glass-panel glass-panel-hover p-4 rounded-2xl relative overflow-hidden group"
          >
            {/* Ambient Accent Glow */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-25 transition-opacity blur-xl pointer-events-none`} />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md shadow-blue-500/10`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                {card.value}
              </h3>
            </div>

            <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
              <span className="text-slate-400 font-medium truncate">
                {card.subtitle}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
