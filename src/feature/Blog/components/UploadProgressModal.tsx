import { LucideLoader2 } from 'lucide-react';
import React from 'react';


interface UploadProgressModalProps {
  isOpen: boolean;
  progress: number;
  message: string;
}

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({ 
  isOpen, 
  progress, 
  message 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <LucideLoader2 className="size-8 animate-spin text-primary-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">{message}</h3>
          <div className="w-full bg-neutral-700 rounded-full h-2.5 mb-4">
            <div 
              className="bg-primary-500 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-neutral-400">
            {progress}% complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadProgressModal;