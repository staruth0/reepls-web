import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-6xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-xl">The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
