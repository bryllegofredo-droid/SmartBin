import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { binService } from '@/services/binService';
import { Bin } from '@/types';

const BinList: React.FC = () => {
    const navigate = useNavigate();
    const [bins, setBins] = useState<Bin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBins = async () => {
            try {
                const binsList = await binService.fetchBins();
                setBins(binsList);
            } catch (error) {
                console.error("Error fetching bins: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBins();
    }, []);

    const formatDate = (date: Timestamp | Date | string) => {
        if (!date) return 'N/A';
        if (date instanceof Timestamp) return date.toDate().toLocaleString();
        if (date instanceof Date) return date.toLocaleString();
        return new Date(date).toLocaleString();
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'online':
                return 'text-emerald-500 bg-emerald-500/10';
            case 'offline':
                return 'text-slate-500 bg-slate-500/10';
            case 'maintenance':
            case 'warning':
                return 'text-orange-500 bg-orange-500/10';
            case 'critical':
                return 'text-red-500 bg-red-500/10';
            default:
                return 'text-blue-500 bg-blue-500/10';
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bin Registry</h1>
                <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                    Add New Bin
                </button>
            </div>

            <div className="glass-widget glass-glow rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned ID</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">MAC Address</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registered</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined animate-spin">refresh</span>
                                            <span>Loading registry...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : bins.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No bins found in registry.</td>
                                </tr>
                            ) : (
                                bins.map((bin) => (
                                    <tr
                                        key={bin.id}
                                        onClick={() => navigate(`/bins/${bin.assignedID}`)}
                                        className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                                    >
                                        <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">
                                            {bin.assignedID || 'N/A'}
                                        </td>
                                        <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                                            {bin.macID || 'N/A'}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            {formatDate(bin.registeredTime)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bin.status)}`}>
                                                {bin.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-slate-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BinList;
