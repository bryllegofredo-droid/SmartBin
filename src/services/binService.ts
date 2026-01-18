import { collection, getDocs, query, where, Timestamp, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Bin, BinHistoryLog, DashboardStats, BinWithStatus } from '@/types';

export const binService = {
    async fetchBins(): Promise<Bin[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'bin_registry'));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Bin[];
        } catch (error) {
            console.error("Error fetching bins: ", error);
            throw error;
        }
    },

    async fetchBinHistory(binId: string): Promise<BinHistoryLog[]> {
        try {
            // Logic check: The user reported issues. 
            // Ensure 'binID' in Firestore matches the passed 'binId'.
            const numericBinId = Number(binId);
            if (isNaN(numericBinId)) {
                console.warn(`Invalid binId: ${binId}`);
                return [];
            }

            const q = query(
                collection(db, 'bin_history'),
                where('binID', '==', numericBinId)
            );

            const querySnapshot = await getDocs(q);
            const logs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as BinHistoryLog[];

            // Client-side sort by timestamp descending
            return logs.sort((a, b) => {
                const timeA = a.timestamp instanceof Timestamp ? a.timestamp.toMillis() : new Date(a.timestamp).getTime();
                const timeB = b.timestamp instanceof Timestamp ? b.timestamp.toMillis() : new Date(b.timestamp).getTime();
                return timeB - timeA;
            });
        } catch (error) {
            console.error("Error fetching bin history: ", error);
            throw error;
        }
    },

    // Re-adding this helper correctly this time, focusing on purely fetching bins with status
    async fetchBinsWithStatus(): Promise<BinWithStatus[]> {
        try {
            const bins = await this.fetchBins();
            const enrichedBins: BinWithStatus[] = [];

            // Get today's date at midnight for comparison
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            await Promise.all(bins.map(async (bin) => {
                const numericBinId = Number(bin.assignedID);

                if (!isNaN(numericBinId)) {
                    const q = query(
                        collection(db, 'bin_history'),
                        where('binID', '==', numericBinId)
                    );
                    const querySnapshot = await getDocs(q);
                    // We only need the latest one for status
                    const logs = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        let millis: number;
                        if (data.timestamp && typeof data.timestamp.toMillis === 'function') {
                            millis = data.timestamp.toMillis();
                        } else {
                            millis = new Date(data.timestamp).getTime();
                        }
                        return { ...data, timestamp: millis };
                    });

                    logs.sort((a, b) => b.timestamp - a.timestamp);
                    const latestLog = logs[0];

                    // Only include bins that have logs from today
                    if (latestLog) {
                        const logDate = new Date(latestLog.timestamp);
                        const isToday = logDate >= today;

                        if (isToday) {
                            enrichedBins.push({
                                ...bin,
                                fillLevel: Number(latestLog.fillPercentage || 0),
                                weight: Number(latestLog.weight || 0),
                                lastUpdated: latestLog.timestamp
                            });
                        }
                    }
                }
            }));
            return enrichedBins;
        } catch (error) {
            console.error("Error fetching bins with status:", error);
            return [];
        }
    },

    async updateBinLocation(binId: string, position: { x: number; y: number }): Promise<void> {
        try {
            const binDoc = doc(db, 'bin_registry', binId);
            await updateDoc(binDoc, { position });
        } catch (error) {
            console.error("Error updating bin location:", error);
            throw error;
        }
    },

    async fetchDashboardStats(): Promise<DashboardStats> {

        try {
            const bins = await this.fetchBins();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let totalWaste = 0;
            let totalFill = 0;
            let fillCount = 0;
            let activeBins = 0;
            let criticalBins = 0;

            // Fetch latest log for each bin to get real-time stats
            await Promise.all(bins.map(async (bin) => {
                const numericBinId = Number(bin.assignedID);
                if (isNaN(numericBinId)) return;

                const q = query(
                    collection(db, 'bin_history'),
                    where('binID', '==', numericBinId)
                );

                const querySnapshot = await getDocs(q);
                const logs = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : new Date(data.timestamp).getTime()
                    };
                });

                // Sort descending
                logs.sort((a, b) => b.timestamp - a.timestamp);

                const latestLog = logs[0];

                if (latestLog) {
                    const logDate = new Date(latestLog.timestamp);
                    const isToday = logDate >= today;

                    if (isToday) {
                        totalWaste += Number(latestLog.weight || 0);
                        activeBins++; // Count as active if it has reported today
                    }

                    if (latestLog) {
                        // We use the latest log for fill level regardless of date for "current status"
                        // But for average calculation, let's include it only if it's relevant (e.g. active)
                        // User requirement was "average fill... active bins". 
                        // Logic: if bin is active (reported today), include in avg fill.
                        if (isToday) {
                            totalFill += Number(latestLog.fillPercentage || 0);
                            fillCount++;

                            if (latestLog.fillPercentage >= 95) {
                                criticalBins++;
                            }
                        }
                    }
                }
            }));

            return {
                totalWaste: parseFloat(totalWaste.toFixed(1)),
                avgFill: fillCount > 0 ? Math.round(totalFill / fillCount) : 0,
                activeBins,
                criticalBins
            };

        } catch (error) {
            console.error("Error fetching dashboard stats: ", error);
            return { totalWaste: 0, avgFill: 0, activeBins: 0, criticalBins: 0 };
        }
    },

    // Get the next available bin ID (finds the highest assignedID and increments)
    async getNextAvailableId(): Promise<string> {
        try {
            const bins = await this.fetchBins();
            if (bins.length === 0) return '1';

            const ids = bins
                .map(bin => parseInt(bin.assignedID, 10))
                .filter(id => !isNaN(id));

            if (ids.length === 0) return '1';

            const maxId = Math.max(...ids);
            return String(maxId + 1);
        } catch (error) {
            console.error("Error getting next available ID:", error);
            return '1';
        }
    },

    // Check if a MAC address already exists in the registry
    async checkMacAddressExists(macAddress: string): Promise<boolean> {
        try {
            const q = query(
                collection(db, 'bin_registry'),
                where('macID', '==', macAddress)
            );
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Error checking MAC address:", error);
            return false;
        }
    },

    // Add a new bin to the registry
    async addBin(macAddress: string, assignedID?: string): Promise<Bin> {
        try {
            // Check if MAC address already exists
            const exists = await this.checkMacAddressExists(macAddress);
            if (exists) {
                throw new Error('A bin with this MAC address already exists');
            }

            // Get next available ID if not provided
            const binId = assignedID || await this.getNextAvailableId();

            const newBin = {
                macID: macAddress,
                assignedID: binId,
                status: 'active',
                registeredTime: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'bin_registry'), newBin);

            return {
                id: docRef.id,
                ...newBin,
                registeredTime: new Date()
            } as Bin;
        } catch (error) {
            console.error("Error adding bin:", error);
            throw error;
        }
    }
};
