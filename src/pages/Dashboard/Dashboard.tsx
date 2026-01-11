import React from 'react';
import StatCard from '@/components/common/StatCard';
import MapWidget from './components/MapWidget';
import AnalyticsPanel from './components/AnalyticsPanel';

// Your actual bin data
const CUSTOM_STATS = [
  {
    id: 'waste',
    label: 'Total Waste Today',
    value: '25.8',
    unit: 'kg',
    trend: 12,
    trendLabel: '+12%',
    icon: 'scale',
    colorClass: 'bg-blue-500/10',
    iconColorClass: 'text-primary'
  },
  {
    id: 'fill',
    label: 'Average Fill Level',
    value: '70%',
    trend: 5,
    trendLabel: '+5%',
    icon: 'delete_forever',
    colorClass: 'bg-orange-500/10',
    iconColorClass: 'text-orange-500'
  },
  {
    id: 'bins',
    label: 'Active Bins',
    value: '3',
    unit: 'Online',
    trend: 0,
    trendLabel: 'All Active',
    icon: 'sensors',
    colorClass: 'bg-green-500/10',
    iconColorClass: 'text-green-500'
  },
  {
    id: 'alerts',
    label: 'Critical Alerts',
    value: '1',
    unit: 'Needs Collection',
    trend: 0,
    trendLabel: '',
    icon: 'warning',
    colorClass: 'bg-red-500/10',
    iconColorClass: 'text-red-500'
  }
];

const Dashboard: React.FC = () => {

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Garbage Bin Monitoring
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Real-time monitoring of Campus Waste Collection (3 Active Bins)
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-slate-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-slate-700 dark:text-slate-200">
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Report</span>
          </button>
          <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CUSTOM_STATS.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} isAlert={index === 3} />
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px]">
        <MapWidget />
        <AnalyticsPanel />
      </div>

    </>
  );
};

export default Dashboard;