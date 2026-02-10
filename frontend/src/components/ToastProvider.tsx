import { FC } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// Funções utilitárias para toast
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
      fontWeight: '600',
      padding: '16px',
      borderRadius: '8px',
    },
    icon: '✅',
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      fontWeight: '600',
      padding: '16px',
      borderRadius: '8px',
    },
    icon: '❌',
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#3b82f6',
      color: '#fff',
      fontWeight: '600',
      padding: '16px',
      borderRadius: '8px',
    },
    icon: 'ℹ️',
  });
};

// Componente Provider para incluir no App
const ToastProvider: FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        },
      }}
    />
  );
};

export default ToastProvider;
