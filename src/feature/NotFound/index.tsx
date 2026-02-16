import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/feed');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary-50 text-secondary-50">
      <h1 className="text-6xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-xl mb-4">The page you are looking for does not exist.</p>
      <button
        onClick={handleGoHome}
        className="px-8 py-2 bg-main-green text-white rounded-3xl text-sm hover:bg-main-yellow transition-colors cursor-pointer">
        Return to Feed
      </button>
    </div>
  );
};

export default NotFound;
