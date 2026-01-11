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