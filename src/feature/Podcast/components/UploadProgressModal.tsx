// components/UploadProgressModal.tsx
import React from 'react';
import { LuLoader } from 'react-icons/lu';

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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]">
      <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <LuLoader className="w-8 h-8 animate-spin text-primary-400" />
          <p className="text-neutral-50 text-lg font-medium">{message}</p>
          <div className="w-full bg-neutral-700 rounded-full h-2.5">
            <div
              className="bg-primary-400 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-neutral-300 text-sm">
            {progress}% complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadProgressModal;