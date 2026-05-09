import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchVerification } from "../services/registrationService";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatDateTime } from "../utils/formatters";

const PublicVerificationPage = () => {
  const { registrationId } = useParams();
  const [state, setState] = useState({ loading: true, data: null, error: "" });

  useEffect(() => {
    fetchVerification(registrationId)
      .then((data) => setState({ loading: false, data: data.data, error: "" }))
      .catch((error) => setState({ loading: false, data: null, error: error?.response?.data?.message || "Not found" }));
  }, [registrationId]);

  if (state.loading) return <LoadingSpinner label="Loading verification..." />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
        <h1 className="text-2xl font-semibold text-white">Registration verification</h1>
        {state.error ? (
          <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{state.error}</div>
        ) : (
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p><strong className="text-white">Registration ID:</strong> {state.data.registrationId}</p>
            <p><strong className="text-white">Name:</strong> {state.data.fullName}</p>
            <p><strong className="text-white">Event:</strong> {state.data.eventName}</p>
            <p><strong className="text-white">Submitted:</strong> {formatDateTime(state.data.submittedAt)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicVerificationPage;
