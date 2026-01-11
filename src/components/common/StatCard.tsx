import React from 'react';
import { StatMetric } from '@/types';

interface StatCardProps {
  stat: StatMetric;
  isAlert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, isAlert }) => {
  return (
    <div className={`glass-widget glass-glow flex flex-col p-5 rounded-2xl relative overflow-hidden group ${isAlert ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${stat.colorClass} ${stat.iconColorClass}`}>
          <span className="material-symbols-outlined">{stat.icon}</span>
        </div>

        {stat.trend !== 0 && (
          <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.trend > 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
            <span className="material-symbols-outlined text-[14px] mr-1">
              {stat.trend > 0 ? 'trending_up' : 'trending_down'}
            </span>
            {stat.trendLabel}
          </span>
        )}

        {isAlert && (
          <button className="text-xs font-medium text-slate-500 hover:text-white transition-colors">View All</button>
        )}
      </div>

      <div className="flex flex-col">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {stat.value} {stat.unit && <span className="text-base font-normal text-slate-500 ml-1">{stat.unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default StatCard;