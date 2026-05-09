import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchRegistration } from "../services/registrationService";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import { API_BASE_URL } from "../utils/apiBase";
import { formatDateTime, formatDate } from "../utils/formatters";
import { campTypeOptions } from "../utils/constants";

const formatCampType = (value) => campTypeOptions.find((option) => option.value === value)?.label || value || "-";

const RegistrationDetailPage = () => {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, data: null });

  useEffect(() => {
    fetchRegistration(id)
      .then((response) => setState({ loading: false, data: response.data }))
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Failed to load registration");
        setState({ loading: false, data: null });
      });
  }, [id]);

  if (state.loading) return <LoadingSpinner label="Loading registration..." />;
  if (!state.data) return <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">Registration not found.</div>;

  const row = state.data;
  const pdfUrl = row.generatedPdf ? `${API_BASE_URL}${row.generatedPdf}` : "";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">{row.fullName}</h2>
            <p className="mt-1 text-sm text-slate-400">Registration ID {row.registrationId}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => pdfUrl && window.open(pdfUrl, "_blank")}
              disabled={!pdfUrl}
            >
              Download PDF
            </Button>
            <Button variant="secondary" onClick={() => window.print()}>Print</Button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Detail label="Camp Type" value={formatCampType(row.campType)} />
          <Detail label="School" value={row.school || "-"} />
          <Detail label="Class Level" value={row.classLevel || "-"} />
          <Detail label="Email" value={row.email} />
          <Detail label="Phone" value={row.phone} />
          <Detail label="Gender" value={row.gender} />
          <Detail label="DOB" value={formatDate(row.dateOfBirth)} />
          <Detail label="Submitted" value={formatDateTime(row.submittedAt)} />
          <Detail label="Consent" value={row.consentAccepted ? "Accepted" : "No"} />
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">Submitted details</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Detail label="Camp Type" value={formatCampType(row.campType)} stacked />
          <Detail label="School" value={row.school || "-"} stacked />
          <Detail label="Class Level" value={row.classLevel || "-"} stacked />
          <Detail label="Address" value={row.address} stacked />
          <Detail label="Medical conditions" value={row.medicalConditions || "-"} stacked />
          <Detail label="Guardian info" value={row.guardianInfo || "-"} stacked />
          <Detail label="Parent/Guardian Name" value={row.parentGuardianContact?.name || "-"} stacked />
          <Detail label="Relationship to camper" value={row.parentGuardianContact?.relationship || "-"} stacked />
          <Detail label="Contact number" value={row.parentGuardianContact?.contactNumber || "-"} stacked />
          <Detail label="Registration ID" value={row.registrationId} stacked />
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value, stacked = false }) => (
  <div className={stacked ? "space-y-1" : ""}>
    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
    <div className="text-sm text-slate-200 break-words">{value}</div>
  </div>
);

export default RegistrationDetailPage;
