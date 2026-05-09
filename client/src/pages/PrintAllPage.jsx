import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchRegistrations } from "../services/registrationService";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import { formatDateTime } from "../utils/formatters";

const PrintAllPage = () => {
  const [state, setState] = useState({ loading: true, data: [] });

  useEffect(() => {
    fetchRegistrations({ limit: 100 })
      .then((response) => setState({ loading: false, data: response.data }))
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Failed to load registrations");
        setState({ loading: false, data: [] });
      });
  }, []);

  const handlePrint = () => window.print();

  if (state.loading) return <LoadingSpinner label="Preparing print view..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">Print all registrations</h2>
            <p className="text-sm text-slate-400">Use this print view to generate a batch hard-copy record.</p>
          </div>
          <Button onClick={handlePrint}>Print Now</Button>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-4">
          {state.data.map((item) => (
            <div key={item._id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <strong className="text-white">{item.fullName}</strong>
                <span className="font-mono text-brand-200">{item.registrationId}</span>
              </div>
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <span>Email: {item.email}</span>
                <span>Phone: {item.phone}</span>
                <span>Submitted: {formatDateTime(item.submittedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintAllPage;
