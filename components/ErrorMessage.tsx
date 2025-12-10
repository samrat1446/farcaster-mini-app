import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p className="text-red-800 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-base-blue hover:bg-base-blue-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};
