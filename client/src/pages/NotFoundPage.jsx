import { Link } from "react-router-dom";
import Button from "../components/Button";

const NotFoundPage = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center px-4 text-center">
      <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
        <h1 className="text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-sm text-slate-400">The page you requested does not exist.</p>
        <div className="mt-6">
          <Link to="/register/default-event">
            <Button>Back to registration</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
