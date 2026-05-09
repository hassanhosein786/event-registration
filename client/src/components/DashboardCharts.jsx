const DashboardCharts = ({ stats }) => {
  const items = [
    { label: "Male", value: stats?.male || 0, color: "bg-brand-500" },
    { label: "Female", value: stats?.female || 0, color: "bg-emerald-500" },
    { label: "Other", value: stats?.other || 0, color: "bg-amber-500" },
    { label: "Recent", value: stats?.recent || 0, color: "bg-rose-500" }
  ];
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Registration snapshot</h3>
          <p className="text-sm text-slate-400">Simple analytics preview</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-semibold text-white">{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCharts;
