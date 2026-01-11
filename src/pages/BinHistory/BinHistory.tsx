import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { binService } from '@/services/binService';
import { BinHistoryLog } from '@/types';

const BinHistory: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Use assignedID
    const navigate = useNavigate();
    const [history, setHistory] = useState<BinHistoryLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchHistory = async () => {
            try {
                const logs = await binService.fetchBinHistory(id);
                setHistory(logs);
            } catch (error) {
                console.error("Error fetching history: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [id]);

    const formatDate = (date: Timestamp | Date | string) => {
        if (!date) return 'N/A';
        if (date instanceof Timestamp) return date.toDate().toLocaleString();
        if (date instanceof Date) return date.toLocaleString();
        return new Date(date).toLocaleString();
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/bins')}
                    className="flex items-center justify-center size-10 rounded-lg bg-surface-light dark:bg-surface-dark hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bin History</h1>
                    <p className="text-slate-500 text-sm">ID: {id}</p>
                </div>
            </div>

            <div className="glass-widget glass-glow rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fill Level</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Weight (kg)</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Distance (cm)</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Signal (RSSI)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined animate-spin">refresh</span>
                                            <span>Loading history...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No history data found for this bin.</td>
                                </tr>
                            ) : (
                                history.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                                            {formatDate(log.timestamp)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${log.fillPercentage > 90 ? 'bg-red-500' : log.fillPercentage > 75 ? 'bg-orange-500' : 'bg-green-500'}`}
                                                        style={{ width: `${Math.min(100, log.fillPercentage)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{log.fillPercentage}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-900 dark:text-white font-medium">
                                            {log.weight}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {log.distance}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {log.rssi} dBm
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

export default BinHistory;
