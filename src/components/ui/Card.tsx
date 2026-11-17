import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({ children, className, hover = false, padding = 'md', onClick }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl shadow-[0_1px_3px_0_rgb(0_0_0_/_0.08),0_1px_2px_-1px_rgb(0_0_0_/_0.08)] border border-slate-100',
        paddingClasses[padding],
        hover && 'card-hover cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color?: string;
  subtitle?: string;
}

export function StatCard({ label, value, icon, trend, color = '#4f46e5', subtitle }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: `${color}18` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        {trend && (
          <span
            className={clsx(
              'text-xs font-semibold px-2 py-0.5 rounded-full',
              trend.positive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-500'
            )}
          >
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </Card>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
      <div className="skeleton h-10 w-10 rounded-xl mb-4" />
      <div className="skeleton h-7 w-24 mb-2" />
      <div className="skeleton h-4 w-32" />
    </div>
  );
}
