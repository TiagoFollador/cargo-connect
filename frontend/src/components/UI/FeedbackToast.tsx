import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface FeedbackToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const FeedbackToast: React.FC<FeedbackToastProps> = ({
  message,
  type,
  onClose,
  duration = 5000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-success" />;
      case 'error':
        return <AlertCircle size={20} className="text-error" />;
      case 'info':
        return <Info size={20} className="text-primary" />;
      default:
        return null;
    }
  };

  const getBackground = () => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/30';
      case 'error':
        return 'bg-error/10 border-error/30';
      case 'info':
        return 'bg-primary/10 border-primary/30';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md slide-up">
      <div className={`flex items-center justify-between rounded-lg border p-4 shadow-md ${getBackground()}`}>
        <div className="flex items-center space-x-3">
          {getIcon()}
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 rounded-full p-1 text-text-secondary hover:bg-white/50 hover:text-text-primary"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default FeedbackToast;