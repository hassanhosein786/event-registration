const Checkbox = ({ label, error, className = "", ...props }) => {
  return (
    <label className={`flex items-start gap-3 text-sm text-slate-200 ${className}`}>
      <input className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-900 text-brand-500 focus:ring-brand-400" type="checkbox" {...props} />
      <span>
        <span className="block font-medium">{label}</span>
        {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
      </span>
    </label>
  );
};

export default Checkbox;
