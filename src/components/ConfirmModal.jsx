import React from 'react';
import PropTypes from 'prop-types';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}) => {
  if (!isOpen) return null;

  const styles = {
    danger: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      btnBg: 'bg-red-600',
      btnHover: 'hover:bg-red-700',
      iconPath: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      )
    },
    warning: {
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      btnBg: 'bg-yellow-600',
      btnHover: 'hover:bg-yellow-700',
      iconPath: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      )
    },
    default: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      btnBg: 'bg-blue-600',
      btnHover: 'hover:bg-blue-700',
      iconPath: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      )
    }
  };

  const currentStyle = styles[variant] || styles.default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in transform transition-all">
        {/* Icon */}
        <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 ${currentStyle.iconBg} rounded-full`}>
          <svg className={`w-6 h-6 ${currentStyle.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {currentStyle.iconPath}
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 ${currentStyle.btnBg} text-white rounded-lg ${currentStyle.btnHover} transition-colors font-medium shadow-sm`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'danger', 'warning'])
};

export default ConfirmModal;
