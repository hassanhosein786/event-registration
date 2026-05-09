import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Button from "../components/Button";

const SuccessPage = () => {
  const location = useLocation();
  const registration = location.state?.registration;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-glow">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-white">Registration submitted</h1>
        <p className="mt-3 text-sm text-slate-400">
          Your entry was saved successfully and the registration PDF has been generated.
        </p>
        {registration?.registrationId && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-200">
            Registration ID: <span className="font-mono text-brand-200">{registration.registrationId}</span>
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={`/verify/${registration?.registrationId || "registration-id"}`}>
            <Button variant="secondary">View verification</Button>
          </Link>
          <Link to="/register/default-event">
            <Button>Submit another registration</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
