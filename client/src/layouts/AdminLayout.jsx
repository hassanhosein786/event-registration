import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FileText, LayoutDashboard, LogOut, Menu, Archive } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Exports", to: "/admin/export", icon: Archive },
  { label: "Print All", to: "/admin/print", icon: FileText }
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { admin, setAdmin, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !admin) {
      navigate("/admin/login", { replace: true });
      return;
    }
    if (!loading && admin && !["admin", "superadmin"].includes(admin.role)) {
      navigate("/campers", { replace: true });
    }
  }, [admin, loading, navigate]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("camper_token");
    setAdmin(null);
    navigate("/admin/login", { replace: true });
  };

  if (loading || !admin) {
    return <div className="flex min-h-screen items-center justify-center text-slate-200">Loading admin session...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar backdrop"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-slate-950/95 transition-transform duration-300 lg:static lg:z-auto lg:block lg:translate-x-0 lg:bg-slate-950/90 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold">Admin Panel</div>
                <div className="text-xs text-slate-400">{admin.email}</div>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed((value) => !value)}
            className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                  isActive ? "bg-brand-500/20 text-brand-100 ring-1 ring-brand-400/20" : "text-slate-300 hover:bg-white/5"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              logout();
            }}
            className="mt-6 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-rose-200 hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>
      </aside>
      <section className="flex-1 lg:ml-0">
        <header className="border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="inline-flex rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Management System</div>
                <h1 className="text-xl font-semibold">Event Registration Management System</h1>
              </div>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              JWT protected
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default AdminLayout;
