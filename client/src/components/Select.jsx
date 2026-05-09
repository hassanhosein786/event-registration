const Select = ({ label, error, options = [], className = "", ...props }) => {
  return (
    <label className={`block text-sm text-slate-200 ${className}`}>
      <span className="mb-1 block font-medium">{label}</span>
      <select className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20" {...props}>
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  );
};

export default Select;
