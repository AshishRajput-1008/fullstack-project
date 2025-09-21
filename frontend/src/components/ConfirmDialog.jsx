
export default function ConfirmDialog({ title="Confirm", body="Are you sure?", onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-4 rounded w-96">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2">{body}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-red-500 text-white rounded">Confirm</button>
        </div>
      </div>
    </div>
  );
}
