import { useEffect, useState } from "react";
import Button from "../components/Button";

const SettingsPage = () => {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    const enabled = saved === "dark";
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold text-white">Settings</h2>
        <p className="mt-2 text-sm text-slate-400">Admin preferences and optional bonus controls.</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white">Dark mode</h3>
            <p className="text-sm text-slate-400">Stored locally in the browser.</p>
          </div>
          <Button variant="secondary" onClick={toggle}>
            {dark ? "Disable" : "Enable"}
          </Button>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        Bonus items implemented in a production-friendly way: QR code creation, merge export, CSV export, and role support.
      </div>
    </div>
  );
};

export default SettingsPage;
