import React, { useState } from 'react';

const MapWidget: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All Bins');

  const filters = [
    { label: 'All Bins (57)', color: 'bg-slate-400' },
    { label: 'Critical (3)', color: 'bg-red-500' },
    { label: 'Active (45)', color: 'bg-primary' },
    { label: 'Low (9)', color: 'bg-emerald-500' },
  ];

  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setActiveFilter(filter.label.split(' ')[0])}
            className={`flex items-center gap-2 h-8 px-3 rounded-full border text-xs font-medium whitespace-nowrap transition-colors
              ${activeFilter === filter.label.split(' ')[0] 
                ? 'bg-slate-800 text-white border-slate-600' 
                : 'bg-surface-light dark:bg-surface-dark border-gray-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800'}
            `}
          >
            <span className={`size-2 rounded-full ${filter.color}`}></span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[600px] lg:h-full min-h-[500px] rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-slate-800 bg-slate-900 group">
        
        {/* Map Image Background */}
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMKIV_c1LXLpAtPhI3BFhDXl_fvvBWGQZUH-ZyD38YpxvqhyPiTwDpTh2H6ZWmsx1jlO5URmLQpF-bygh4YtvyRwBp64ApzJSr96OHPYLiWkEWgpuP7UG-spY1iK-Z8lymkBmPinrrHLq2sAt9bqhC6fQSEPi2pwYFqH7-B4dBppGJKoXM8QyjsotGYgcvPQS7i976ENE62SXBj1H9v6YKta6Ced9oN9J2Nj28eNeS_K9Z1OaL0tokYQmjTcChU3objlsy2DL_Z8k" 
          alt="City Map"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent pointer-events-none"></div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {['my_location', 'add', 'remove'].map((icon) => (
            <button key={icon} className="size-10 flex items-center justify-center rounded-lg bg-surface-dark/90 backdrop-blur text-white border border-slate-700 shadow-lg hover:bg-surface-dark transition-colors">
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
        </div>

        {/* Critical Pin with Tooltip */}
        <div className="absolute top-[40%] left-[35%] flex flex-col items-center group/pin z-20">
          <div className="relative flex items-center justify-center cursor-pointer">
            <div className="absolute size-4 bg-red-500/50 rounded-full animate-ping"></div>
            <span className="material-symbols-outlined text-red-500 text-4xl drop-shadow-lg hover:scale-110 transition-transform">location_on</span>
          </div>
          
          {/* Tooltip Card */}
          <div className="absolute bottom-full mb-2 w-64 p-3 rounded-lg bg-surface-dark/95 backdrop-blur border border-slate-700 shadow-xl pointer-events-none opacity-100 transform translate-y-0 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-bold text-white">Bin #402</h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-500 text-white rounded">96% FULL</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">Main St. & 4th Ave</p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '96%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Last pickup: 2d ago</span>
              <button className="text-xs text-primary font-medium hover:underline">Dispatch</button>
            </div>
             {/* Triangle Pointer */}
             <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-700"></div>
          </div>
        </div>

        {/* Other Pins */}
        <div className="absolute top-[30%] left-[60%] flex flex-col items-center hover:z-10">
          <span className="material-symbols-outlined text-primary text-3xl drop-shadow-md cursor-pointer hover:scale-110 transition-transform hover:text-blue-400">location_on</span>
        </div>
        
        <div className="absolute top-[65%] left-[50%] flex flex-col items-center hover:z-10">
          <span className="material-symbols-outlined text-primary text-3xl drop-shadow-md cursor-pointer hover:scale-110 transition-transform hover:text-blue-400">location_on</span>
        </div>

        <div className="absolute top-[55%] left-[25%] flex flex-col items-center hover:z-10">
          <span className="material-symbols-outlined text-emerald-500 text-3xl drop-shadow-md cursor-pointer hover:scale-110 transition-transform hover:text-emerald-400">location_on</span>
        </div>

        <div className="absolute bottom-[20%] right-[35%] flex flex-col items-center hover:z-10">
           <span className="material-symbols-outlined text-emerald-500 text-3xl drop-shadow-md cursor-pointer hover:scale-110 transition-transform hover:text-emerald-400">location_on</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark/95 to-transparent flex justify-between items-end">
          <div className="flex items-center gap-3 text-white/80 text-xs">
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500"></span> {'>'}90% Full</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary"></span> 50-90% Full</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500"></span> {'<'}50% Full</span>
          </div>
          <div className="text-white/60 text-[10px]">Map data © Mapbox</div>
        </div>

      </div>
    </div>
  );
};

export default MapWidget;