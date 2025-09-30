import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastContext, Toast as ToastType } from '../context/ToastContext';

const toastVariants = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-800',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-800',
    icon: Info,
    iconColor: 'text-blue-500',
  },
};

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useToastContext();
  const variant = toastVariants[toast.type];
  const Icon = variant.icon;

  return (
    <div
      className={`
        ${variant.bg} ${variant.border} ${variant.text}
        border-l-4 rounded-lg shadow-lg p-4 mb-3 
        flex items-start gap-3 min-w-[320px] max-w-md
        animate-slide-in-right
      `}
    >
      <Icon className={`${variant.iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className={`${variant.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Toast() {
  const { toasts } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}