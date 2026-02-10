import { FC, ReactNode } from 'react';
import '../../styles/admin.css';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  label?: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

const KPICard: FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  label,
  variant = 'primary'
}) => {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <span className="kpi-card-title">{title}</span>
        <div className={`kpi-card-icon ${variant}`}>
          {icon}
        </div>
      </div>
      
      <div className="kpi-card-value">
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
      </div>
      
      {(trend || label) && (
        <div className="kpi-card-footer">
          {trend && (
            <span className={`kpi-card-trend ${trend.isPositive ? 'up' : 'down'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
          {label && <span className="kpi-card-label">{label}</span>}
        </div>
      )}
    </div>
  );
};

export default KPICard;
