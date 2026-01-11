import React from 'react';
import { NavLink } from 'react-router-dom';


const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark px-6 py-3 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
          <div className="text-primary size-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">recycling</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">SmartBin OS</h2>
        </div>


      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex items-center gap-6">
          {[
            { label: 'Dashboard', path: '/' },
            { label: 'Fleet Map', path: '/map' },
            { label: 'Bin List', path: '/bins' },
            { label: 'Analytics', path: '/analytics' }
          ].map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 border-l border-gray-200 dark:border-slate-700 pl-6">
          <button className="relative text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
          </button>

          <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600 cursor-pointer hover:border-primary transition-colors">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsi2j08fY7aB4Qs0ByOlcCo54VjruwArWMeI_9l9mjZdNKtxHXcUHBpr_n957QPHqz7RD2QGSB0WHRLc6WdOscbDEVVcxEHU2XYRy5dx6Jw3cjTsjD3Nacrg_86KWxqNf10a0ek42uKeFsrtfFRtTaSjJ_dhOuVIzq6zeTYlcyynSSbFqCdkBl5HiH3NbAoMWHSPlVrUPiFhwbGzMQ34NDWEtxzlvQR58rPDRF9uwM6jb2q818HmvopPYq-O7E-k6I9YD9AdnSXXQ"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;