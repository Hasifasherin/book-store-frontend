"use client";

type DeleteModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  deleting?: boolean;
};

export default function DeleteModal({ onConfirm, onCancel, deleting }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded text-center space-y-4 shadow-lg">
        <p>Delete this book?</p>
        <div className="flex gap-2">
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded w-1/2 hover:bg-red-700">
            {deleting ? "Deleting…" : "Yes"}
          </button>
          <button onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded w-1/2 hover:bg-gray-500">
            No
          </button>
        </div>
      </div>
    </div>
  );
}
