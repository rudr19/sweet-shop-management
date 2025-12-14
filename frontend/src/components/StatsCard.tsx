import React from 'react';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  bgColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, bgColor, trend }) => {
  return (
    <div className="card" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-lg)',
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--text-2xl)',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
          marginBottom: 'var(--spacing-xs)',
        }}>
          {value}
        </div>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
        }}>
          {label}
          {trend && (
            <span style={{
              fontSize: 'var(--text-xs)',
              color: trend.isPositive ? 'var(--color-success)' : 'var(--color-danger)',
              fontWeight: 'var(--font-medium)',
            }}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
