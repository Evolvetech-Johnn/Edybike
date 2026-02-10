import { FC } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
}

const StatusBadge: FC<StatusBadgeProps> = ({ status, variant }) => {
  // Auto-detectar variant baseado no status se não fornecido
  const getVariant = (): BadgeVariant => {
    if (variant) return variant;
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('aprovado') || statusLower.includes('entregue') || statusLower.includes('ativo')) {
      return 'success';
    }
    if (statusLower.includes('pendente') || statusLower.includes('aguardando')) {
      return 'warning';
    }
    if (statusLower.includes('cancelado') || statusLower.includes('recusado') || statusLower.includes('inativo')) {
      return 'danger';
    }
    if (statusLower.includes('enviado') || statusLower.includes('transito')) {
      return 'info';
    }
    
    return 'primary';
  };

  return (
    <span className={`admin-badge ${getVariant()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
