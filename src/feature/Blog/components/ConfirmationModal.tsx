// components/molecules/modals/ConfirmationModal.tsx
import React from "react";

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  confirmColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  confirmColor = "primary",
}) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[999]">
      <div className="bg-neutral-800 rounded-lg p-6 m-5 sm:m-0  max-w-md w-full">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md bg-${confirmColor}-500 hover:bg-${confirmColor}-600 transition text-white`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;