"use client";

type DeleteModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  deleting?: boolean;
};

export default function DeleteModal({ onConfirm, onCancel, deleting }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80 max-w-[90%] text-center space-y-6">
        {/* Title */}
        <p className="text-lg font-semibold text-[#1E293B]">
          Are you sure you want to delete this book?
        </p>

        {/* Description */}
        <p className="text-sm text-gray-500">
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
          >
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
