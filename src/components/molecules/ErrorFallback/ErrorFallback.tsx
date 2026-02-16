// components/molecules/ErrorFallback/ErrorFallback.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FallbackProps } from 'react-error-boundary'; // Import FallbackProps
import { t } from 'i18next';

// Use FallbackProps directly instead of defining a custom interface
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-center text-red-500 bg-red-100 rounded-md max-w-md mx-auto my-4">
      <h2 className="text-xl font-semibold mb-2">{t("Oops, something went wrong!")}</h2>
      {/* will make error message show up only in development soon */}

        <p className="mb-4 text-sm">{error.message || 'An unexpected error occurred.'}</p>
   
      <div className="flex justify-center gap-4">
        {/* Reload Page Button */}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          {t("Reload Page")}
        </button>
        {/* Go to Feed Button */}
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          onClick={() => navigate('/feed')}
        >
          {("Go to Feed")}
        </button>
        {/* Retry Button (required by FallbackProps) */}
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={resetErrorBoundary}
        >
          {t("Try Again")}
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;