"use client";

export default function QuitConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Yes, quit",
  cancelLabel = "No, stay",
  onConfirm,
  onCancel,
  busy,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inkdeep/80 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="parlor-card rounded-2xl p-6 max-w-sm w-full shadow-card text-center">
        <div className="font-display font-bold text-inkdeep text-lg mb-2">{title}</div>
        <p className="text-inkdeep/70 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-lg border-2 border-inkdeep/15 text-inkdeep font-display font-bold py-3 hover:border-inkdeep/30 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 rounded-lg bg-dauber text-card font-display font-bold py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {busy ? "…" : confirmLabel}
          </button>
        </div>
        <div className="text-xs text-inkdeep/40 mt-4">Game paused</div>
      </div>
    </div>
  );
}
