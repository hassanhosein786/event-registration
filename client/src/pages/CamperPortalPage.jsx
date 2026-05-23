import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import RegistrationsTable from "../components/RegistrationsTable";
import { fetchRegistrations } from "../services/registrationService";
import { useDebounce } from "../hooks/useDebounce";

const CamperPortalPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
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

      <RegistrationsTable data={registrations} showActions={false} />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {registrations.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-400">
          No camper records found.
        </div>
      )}
    </div>
  );
};

export default CamperPortalPage;
