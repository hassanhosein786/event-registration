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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 px-0 py-0 sm:px-4 sm:py-6">
      <div className="min-h-full w-full sm:flex sm:items-center sm:justify-center">
        <div className="flex min-h-[100dvh] w-full flex-col rounded-none border-0 border-white/10 bg-slate-950 shadow-glow sm:min-h-0 sm:max-h-[85vh] sm:max-w-lg sm:rounded-3xl sm:border">
          <div className="border-b border-white/10 px-4 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-white sm:text-lg">{title}</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 text-sm text-slate-300 sm:px-6">
            {children}
          </div>
          <div className="border-t border-white/10 px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6 sm:pb-4">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
      </div>
    </div>
  );
};

export default Modal;
