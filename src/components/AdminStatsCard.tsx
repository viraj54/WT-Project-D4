import { ReactNode } from 'react';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export function AdminStatsCard({ title, value, icon, trend, trendUp }: AdminStatsCardProps) {
  return (
    <div className="bg-surface p-6 rounded-2xl shadow-soft border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-primary-50 rounded-xl text-primary">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trendUp ? 'text-secondary-600' : 'text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-text-muted text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-text-main">{value}</div>
    </div>
  );
}
