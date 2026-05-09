const FileUpload = ({ label, error, multiple = false, onChange, className = "" }) => {
  return (
    <label className={`block text-sm text-slate-200 ${className}`}>
      <span className="mb-1 block font-medium">{label}</span>
      <input
        type="file"
        multiple={multiple}
        onChange={onChange}
        className="mt-1 block w-full rounded-2xl border border-dashed border-white/15 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-white hover:file:bg-brand-400"
      />
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  );
};

export default FileUpload;
