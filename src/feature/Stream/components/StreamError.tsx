import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StreamErrorProps {
  error: Error | null;
  onRetry?: () => void;
}

const StreamError: React.FC<StreamErrorProps> = ({ error, onRetry }) => {
  const navigate = useNavigate();

  const getErrorMessage = (error: Error | null): string => {
    if (!error) return 'An unexpected error occurred.';
    
    if (error.message.includes('Network Error')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    if (error.message.includes('404')) {
      return 'Stream not found. The stream you are looking for does not exist.';
    }
    
    if (error.message.includes('500')) {
      return 'Server error. Please try again later.';
    }
    
    return error.message || 'Something went wrong while loading the stream.';
  };

  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      {/* Main content */}
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        {/* Topbar */}
        <div className="bg-background border-b border-neutral-500 px-4 py-3">
          <div className="text-lg font-semibold text-neutral-50">Stream Detail</div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            {/* Error Title */}
            <h2 className="text-xl font-semibold text-neutral-50 mb-2">
              Oops! Something went wrong
            </h2>

            {/* Error Message */}
            <p className="text-neutral-300 mb-6 max-w-md">
              {getErrorMessage(error)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </button>
              
              <button
                onClick={() => navigate('/feed')}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Feed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="communique sidebar bg-background hidden lg:block">
        <div className="p-4">
          <div className="text-sm text-neutral-400">
            Related streams and content will appear here once the page loads successfully.
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamError;
