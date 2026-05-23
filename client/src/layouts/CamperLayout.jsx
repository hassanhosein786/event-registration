import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const CamperLayout = () => {
  const navigate = useNavigate();
  const { admin, setAdmin, loading } = useAuth("camper_token");

  useEffect(() => {
    if (!loading && !admin) {
      navigate("/campers/login", { replace: true });
      return;
    }
    if (!loading && admin && admin.role !== "camper") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [admin, loading, navigate]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("camper_token");
    setAdmin(null);
    navigate("/campers/login", { replace: true });
  };

  if (loading || !admin) {
    return <div className="flex min-h-screen items-center justify-center text-slate-200">Loading camper session...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button type="button" className="inline-flex rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5" aria-label="Camper portal menu">
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Camper Portal</div>
              <h1 className="text-xl font-semibold">Read-only camper lookup</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              Campers only
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CamperLayout;
