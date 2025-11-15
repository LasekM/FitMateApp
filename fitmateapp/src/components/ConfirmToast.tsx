import React from "react";

interface ConfirmToastProps {
  closeToast?: () => void;
  onConfirm: () => void;
  message: string;
}

export const ConfirmToast: React.FC<ConfirmToastProps> = ({
  closeToast,
  onConfirm,
  message,
}) => {
  const handleConfirm = () => {
    onConfirm();
    if (closeToast) closeToast();
  };

  const handleCancel = () => {
    if (closeToast) closeToast();
  };

  return (
    <div className="text-white">
      <p className="font-semibold mb-3">{message}</p>
      <div className="flex gap-2">
        <button
          onClick={handleConfirm}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm"
        >
          Delete
        </button>
        <button
          onClick={handleCancel}
          className="bg-zinc-600 hover:bg-zinc-700 text-white font-bold py-1 px-3 rounded-md text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
