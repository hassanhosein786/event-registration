const StatCard = ({ label, value, icon: Icon, accent = "brand" }) => {
  const colors = {
    brand: "from-brand-500/20 to-brand-400/5 text-brand-100",
    green: "from-emerald-500/20 to-emerald-400/5 text-emerald-100",
    amber: "from-amber-500/20 to-amber-400/5 text-amber-100",
    rose: "from-rose-500/20 to-rose-400/5 text-rose-100"
  };

  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br p-5 shadow-glow ${colors[accent]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-300">{label}</div>
          <div className="mt-2 text-3xl font-semibold">{value}</div>
        </div>
        {Icon && (
          <div className="rounded-2xl bg-white/10 p-3">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
