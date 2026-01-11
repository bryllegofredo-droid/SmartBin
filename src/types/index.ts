import { Timestamp } from 'firebase/firestore';

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  trend: number;
  trendLabel: string; // e.g., "+12%"
  icon: string;
  colorClass: string; // Tailwind color class for icon bg
  iconColorClass: string;
}

export interface PickupLog {
  id: string;
  binId: string;
  location: string;
  time: string;
  weight: string;
  status: 'completed' | 'pending';
}

export interface ChartData {
  name: string;
  value: number;
}

export interface Bin {
  id: string; // Firestore document ID
  assignedID: string;
  macID: string;
  registeredTime: Timestamp | Date | string;
  status: string;
  position?: {
    x: number;
    y: number;
  };
}

export interface BinHistoryLog {
  id: string;
  binID: number;
  distance: number;
  fillPercentage: number;
  macID: string;
  rssi: number;
  weight: number;
  timestamp: Timestamp | Date | string;
}

export interface BinWithStatus extends Bin {
  fillLevel: number;
  weight: number;
  lastUpdated: number;
}

export interface DashboardStats {
  totalWaste: number;
  avgFill: number;
  activeBins: number;
  criticalBins: number;
}