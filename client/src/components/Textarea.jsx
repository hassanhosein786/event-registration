const base = "mt-1 min-h-28 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20";

const Textarea = ({ label, error, className = "", ...props }) => {
  return (
    <label className={`block text-sm text-slate-200 ${className}`}>
      <span className="mb-1 block font-medium">{label}</span>
      <textarea className={base} {...props} />
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  );
};

export default Textarea;
