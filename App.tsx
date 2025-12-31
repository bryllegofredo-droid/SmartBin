import React from 'react';
import Header from './components/Header';
import StatCard from './components/StatCard';
import MapWidget from './components/MapWidget';
import AnalyticsPanel from './components/AnalyticsPanel';
import { STATS } from './constants';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Page Header & Key Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Fleet Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Real-time monitoring of City Center Zone (57 Active Bins)</p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-slate-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-slate-700 dark:text-slate-200">
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Report</span>
            </button>
            <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add New Bin</span>
            </button>
          </div>
        </div>

        {/* KPI Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} isAlert={index === 3} />
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px]">
          <MapWidget />
          <AnalyticsPanel />
        </div>

      </main>
    </div>
  );
};

export default App;