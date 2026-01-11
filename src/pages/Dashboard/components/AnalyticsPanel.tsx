import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';
import { WEEKLY_VOLUME, DONUT_DATA, PICKUP_LOGS } from '@/utils/constants';

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

        {/* Donut Chart */}
        <div className="h-48 relative mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DONUT_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {DONUT_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">68%</span>
            <span className="text-xs text-slate-500">Avg Fill</span>
            <tspan x="50%" dy="1.2em" className="text-sm font-semibold" fill="#94a3b8">25.8 kg</tspan>

          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex flex-col gap-2 flex-1 min-h-[140px]">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Weekly Volume (kg)</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_VOLUME} barSize={24}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                dy={10}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {WEEKLY_VOLUME.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value === 75 ? '#137fec' : '#334155'}
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Pickups List */}
      <div className="glass-widget glass-glow flex flex-col rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recent Pickups</h3>
          <a className="text-xs text-primary hover:underline cursor-pointer">View Log</a>
        </div>
        <div className="flex flex-col">
          {PICKUP_LOGS.map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-slate-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <div className="size-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{log.binId}</p>
                <p className="text-[10px] text-slate-500">{log.location} • {log.time}</p>
              </div>
              <span className="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">{log.weight}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPanel;