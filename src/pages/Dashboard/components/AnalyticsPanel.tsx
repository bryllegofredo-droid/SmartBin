import React from 'react';

const AnalyticsPanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">

      {/* Analytics Card */}
      <div className="glass-widget glass-glow flex flex-col p-5 rounded-2xl flex-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Capacity Analytics</h3>
          <button className="text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        {/* Empty State for Charts */}
        <div className="flex flex-col items-center justify-center flex-1 min-h-[200px] text-center text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-20">bar_chart</span>
          <p className="text-sm">No analytics data available yet.</p>
        </div>
      </div>

      {/* Recent Pickups List */}
      <div className="glass-widget glass-glow flex flex-col rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recent Pickups</h3>
        </div>
        <div className="flex flex-col p-8 text-center text-slate-400">
          <span className="material-symbols-outlined text-3xl mb-2 opacity-20">history</span>
          <p className="text-sm">No recent pickups logged.</p>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPanel;