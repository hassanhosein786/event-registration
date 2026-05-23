import Button from "./Button";

const Modal = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  danger = false,
  hideCancel = false
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-glow">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="mt-3 text-sm text-slate-300">{children}</div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {!hideCancel && (
            <Button variant="secondary" className="w-full sm:w-auto" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button variant={danger ? "danger" : "primary"} className="w-full sm:w-auto" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
