import { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    warning: 'bg-yellow-500 border-yellow-600',
    info: 'bg-blue-500 border-blue-600',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 min-w-[300px] max-w-md p-4 rounded-lg shadow-lg text-white border-l-4 
        ${typeStyles[type]} animate-slide-in-right`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{icons[type]}</span>
        <div className="flex-1">
          <p className="text-sm font-medium break-words">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
          aria-label="Close notification"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
