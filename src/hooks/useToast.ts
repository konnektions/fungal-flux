import { useToastContext } from '../context/ToastContext';

export function useToast() {
  const { addToast } = useToastContext();

  const success = (message: string) => {
    addToast({ type: 'success', message });
  };

  const error = (message: string) => {
    addToast({ type: 'error', message });
  };

  const warning = (message: string) => {
    addToast({ type: 'warning', message });
  };

  const info = (message: string) => {
    addToast({ type: 'info', message });
  };

  return {
    success,
    error,
    warning,
    info,
  };
}