import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { binService } from '@/services/binService';
import { Bin } from '@/types';

const BinList: React.FC = () => {
    const navigate = useNavigate();
    const [bins, setBins] = useState<Bin[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [macAddress, setMacAddress] = useState('');
    const [nextId, setNextId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchBins = async () => {
        try {
            setLoading(true);
            const binsList = await binService.fetchBins();
            setBins(binsList);
        } catch (error) {
            console.error("Error fetching bins: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBins();
    }, []);

    const openAddModal = async () => {
        setShowAddModal(true);
        setMacAddress('');
        setError('');
        // Fetch next available ID
        const id = await binService.getNextAvailableId();
        setNextId(id);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setMacAddress('');
        setError('');
    };

    const handleAddBin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!macAddress.trim()) {
            setError('MAC ID is required');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await binService.addBin(macAddress.trim(), nextId);
            closeModal();
            fetchBins(); // Refresh the list
        } catch (err: any) {
            setError(err.message || 'Failed to add bin');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                >
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

            {/* Add New Bin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Bin</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleAddBin} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Assigned ID
                                </label>
                                <input
                                    type="text"
                                    value={nextId}
                                    disabled
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-slate-500">Auto-generated based on existing bins</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    MAC ID <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={macAddress}
                                    onChange={(e) => setMacAddress(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                >
                                    <option value="">Select a MAC ID</option>
                                    {bins.map((bin) => (
                                        <option key={bin.id} value={bin.macID}>
                                            {bin.macID} (ID: {bin.assignedID})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Bin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BinList;
