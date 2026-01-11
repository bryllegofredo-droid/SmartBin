import { StatMetric, PickupLog, ChartData } from '@/types';

export const STATS: StatMetric[] = [
  {
    id: 'waste',
    label: 'Waste Collected Today',
    value: '1,240',
    unit: 'kg',
    trend: 12,
    trendLabel: '+12%',
    icon: 'scale',
    colorClass: 'bg-blue-500/10',
    iconColorClass: 'text-primary'
  },
  {
    id: 'fill',
    label: 'Average Fill Rate',
    value: '68%',
    trend: 5,
    trendLabel: '+5%',
    icon: 'delete_forever',
    colorClass: 'bg-orange-500/10',
    iconColorClass: 'text-orange-500'
  },
  {
    id: 'efficiency',
    label: 'Efficiency Score',
    value: '92%',
    trend: -2,
    trendLabel: '-2%',
    icon: 'bolt',
    colorClass: 'bg-purple-500/10',
    iconColorClass: 'text-purple-500'
  },
  {
    id: 'alerts',
    label: 'Critical Alerts',
    value: '3',
    unit: 'Bins Full',
    trend: 0,
    trendLabel: '', // Special case handled in component
    icon: 'warning',
    colorClass: 'bg-red-500/10',
    iconColorClass: 'text-red-500'
  }
];

export const PICKUP_LOGS: PickupLog[] = [
  {
    id: '1',
    binId: 'Bin #105',
    location: 'Market Square',
    time: '10m ago',
    weight: '45kg',
    status: 'completed'
  },
  {
    id: '2',
    binId: 'Bin #088',
    location: 'Tech Park',
    time: '42m ago',
    weight: '32kg',
    status: 'completed'
  },
  {
    id: '3',
    binId: 'Bin #210',
    location: 'Central Station',
    time: '1h ago',
    weight: '68kg',
    status: 'completed'
  }
];

export const WEEKLY_VOLUME: ChartData[] = [
  { name: 'M', value: 40 },
  { name: 'T', value: 65 },
  { name: 'W', value: 50 },
  { name: 'T', value: 85 },
  { name: 'F', value: 75 },
  { name: 'S', value: 30 },
  { name: 'S', value: 45 },
];

export const DONUT_DATA = [
  { name: 'Filled', value: 68, fill: '#137fec' },
  { name: 'Empty', value: 32, fill: '#334155' },
];