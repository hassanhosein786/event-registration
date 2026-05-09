import { Outlet, Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-200 ring-1 ring-brand-400/30">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-200">
                Montrose Muslim Association Islamic Summer Camp 2026
              </div>
              <div className="text-xs text-slate-400">Public portal</div>
            </div>
          </Link>
        </div>
      </header>
      <main className="bg-transparent">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
