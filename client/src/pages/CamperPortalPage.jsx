import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import { fetchRegistrations } from "../services/registrationService";
import { useDebounce } from "../hooks/useDebounce";
import { calculateAge, formatDate, formatDateTime } from "../utils/formatters";
import { campTypeOptions } from "../utils/constants";

const formatCampType = (value) => campTypeOptions.find((option) => option.value === value)?.label || value || "-";

const CamperPortalPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  const query = useMemo(
    () => ({
      page,
      search: debouncedSearch,
      sortBy: "submittedAt",
      order: "desc",
      limit: 10
    }),
    [page, debouncedSearch]
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const load = async () => {
      setRefreshing(true);
      try {
        const response = await fetchRegistrations(query);
        setRegistrations(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load camper records");
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    };

    load();
  }, [query]);

  if (initialLoading) return <LoadingSpinner label="Loading camper records..." />;

  return (
    <div className="space-y-6">
      {refreshing && (
        <div className="fixed right-4 top-4 z-50 rounded-full border border-white/10 bg-slate-950/90 px-4 py-2 text-xs font-medium text-slate-300 shadow-2xl shadow-black/30">
          Updating camper records...
        </div>
      )}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Camper records</h2>
            <p className="mt-1 text-sm text-slate-400">Search and view camper information only.</p>
          </div>
          <div className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
            Read-only portal
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <Input
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name, email, phone, registration ID"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-slate-950/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Age</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {registrations.map((row) => (
                <tr key={row._id} className="hover:bg-white/5">
                  <td className="px-4 py-4 align-top text-sm text-slate-200">{row.fullName}</td>
                  <td className="px-4 py-4 align-top text-sm text-slate-200">{row.age ?? calculateAge(row.dateOfBirth)}</td>
                  <td className="px-4 py-4 align-top text-sm text-slate-200">
                    <Button className="px-3 py-2 text-xs" onClick={() => setSelectedRow(row)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {registrations.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-400">
          No camper records found.
        </div>
      )}

      <Modal open={Boolean(selectedRow)} title={selectedRow?.fullName || "Camper details"} onClose={() => setSelectedRow(null)} confirmText="Close" onConfirm={() => setSelectedRow(null)}>
        {selectedRow && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail label="Registration ID" value={selectedRow.registrationId} />
            <Detail label="Camp Type" value={formatCampType(selectedRow.campType)} />
            <Detail label="Age" value={selectedRow.age ?? calculateAge(selectedRow.dateOfBirth)} />
            <Detail label="Gender" value={selectedRow.gender || "-"} />
            <Detail label="School" value={selectedRow.school || "-"} />
            <Detail label="Class Level" value={selectedRow.classLevel || "-"} />
            <Detail label="Date of Birth" value={formatDate(selectedRow.dateOfBirth)} />
            <Detail label="Phone" value={selectedRow.phone || "-"} />
            <Detail label="Email" value={selectedRow.email || "-"} />
            <Detail label="Address" value={selectedRow.address || "-"} />
            <Detail label="Medical Conditions" value={selectedRow.medicalConditions || "-"} />
            <Detail label="Parent/Guardian Name" value={selectedRow.parentGuardianContact?.name || "-"} />
            <Detail label="Relationship" value={selectedRow.parentGuardianContact?.relationship || "-"} />
            <Detail label="Contact Number" value={selectedRow.parentGuardianContact?.contactNumber || "-"} />
            <Detail label="Consent Accepted" value={selectedRow.consentAccepted ? "Yes" : "No"} />
            <Detail label="Rules Accepted" value={selectedRow.consentRulesAccepted ? "Yes" : "No"} />
            <Detail label="Submitted At" value={formatDateTime(selectedRow.submittedAt)} />
          </div>
        )}
      </Modal>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
    <div className="mt-1 break-words text-sm text-slate-200">{value}</div>
  </div>
);

export default CamperPortalPage;
