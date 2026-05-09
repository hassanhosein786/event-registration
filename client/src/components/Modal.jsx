import Button from "./Button";

const Modal = ({ open, title, children, onClose, onConfirm, confirmText = "Confirm", danger = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-glow">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="mt-3 text-sm text-slate-300">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
