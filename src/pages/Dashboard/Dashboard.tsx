import React, { useEffect, useState } from 'react';
import StatCard from '@/components/common/StatCard';
import MapWidget from './components/MapWidget';
import AnalyticsPanel from './components/AnalyticsPanel';
import { binService } from '@/services/binService';
import { Bin, DashboardStats, BinWithStatus } from '@/types';

const Dashboard: React.FC = () => {
  const [bins, setBins] = useState<BinWithStatus[]>([]);
  const [statsData, setStatsData] = useState<DashboardStats>({ totalWaste: 0, avgFill: 0, activeBins: 0, criticalBins: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const stats = await binService.fetchDashboardStats();
      const bins = await binService.fetchBinsWithStatus();

      setBins(bins);
      setStatsData(stats);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      id: 'waste',
      label: 'Total Waste Today',
      value: loading ? '-' : statsData.totalWaste.toString(),
      unit: 'kg',
      trend: 0,
      trendLabel: 'Today',
      icon: 'scale',
      colorClass: 'bg-blue-500/10',
      iconColorClass: 'text-primary'
    },
    {
      id: 'fill',
      label: 'Average Fill Level',
      value: loading ? '-' : `${statsData.avgFill}%`,
      trend: 0,
      trendLabel: 'Real-time',
      icon: 'delete_forever',
      colorClass: 'bg-orange-500/10',
      iconColorClass: 'text-orange-500'
    },
    {
      id: 'bins',
      label: 'Active Bins',
      value: loading ? '-' : statsData.activeBins.toString(),
      unit: 'Today',
      trend: 0,
      trendLabel: 'Active',
      icon: 'sensors',
      colorClass: 'bg-green-500/10',
      iconColorClass: 'text-green-500'
    },
    {
      id: 'alerts',
      label: 'Critical Alerts',
      value: loading ? '-' : statsData.criticalBins.toString(),
      unit: 'Bins Full',
      trend: 0,
      trendLabel: '> 95%',
      icon: 'warning',
      colorClass: 'bg-red-500/10',
      iconColorClass: 'text-red-500'
    }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Garbage Bin Monitoring
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Real-time monitoring of Campus Waste Collection
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
            <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} isAlert={index === 3} />
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px]">
        <MapWidget bins={bins} />
        <AnalyticsPanel />
      </div>

    </>
  );
};

export default Dashboard;