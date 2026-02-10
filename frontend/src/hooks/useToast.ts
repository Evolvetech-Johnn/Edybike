import { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from '../components/ToastProvider';

export const useToast = () => {
  return {
    success: showSuccessToast,
    error: showErrorToast,
    warning: showWarningToast,
    info: showInfoToast
  };
};
