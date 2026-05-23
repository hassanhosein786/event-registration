import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../components/Input";
import Select from "../components/Select";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import RegistrationsTable from "../components/RegistrationsTable";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import { fetchRegistrations, deleteRegistration, fetchAnalytics } from "../services/registrationService";
import { useDebounce } from "../hooks/useDebounce";
import { sortOptions, genderOptions, campTypeOptions } from "../utils/constants";
import { API_BASE_URL } from "../utils/apiBase";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [campType, setCampType] = useState("");
  const [sortValue, setSortValue] = useState("submittedAt:desc");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  const sortQuery = useMemo(() => {
    const [sortBy, order] = sortValue.split(":");
    return { sortBy, order };
  }, [sortValue]);

  const load = async () => {
    setRefreshing(true);
    try {
      const [response, stats] = await Promise.all([
          fetchRegistrations({
            page,
            search: debouncedSearch,
            gender,
            campType,
            sortBy: sortQuery.sortBy,
            order: sortQuery.order,
            limit: 10
        }),
        fetchAnalytics()
      ]);
      setRegistrations(response.data);
      setTotalPages(response.meta.totalPages);
      setAnalytics(stats.data);
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login");
        return;
      }
      toast.error(error?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, gender, campType, sortQuery.sortBy, sortQuery.order]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, gender, campType, sortQuery.sortBy, sortQuery.order]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRegistration(deleteTarget._id);
      toast.success("Registration deleted");
      setDeleteTarget(null);
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleDownloadPdf = (row) => {
    const href = `${API_BASE_URL}${row.generatedPdf}`;
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.click();
  };

  const handlePrint = (row) => {
    const href = `${API_BASE_URL}${row.generatedPdf}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  if (initialLoading) return <LoadingSpinner label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      {refreshing && (
        <div className="fixed right-4 top-4 z-50 rounded-full border border-white/10 bg-slate-950/90 px-4 py-2 text-xs font-medium text-slate-300 shadow-2xl shadow-black/30">
          Updating dashboard...
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total registrations" value={analytics?.total || 0} icon={ShieldCheck} />
        <StatCard label="Stay in Camp" value={analytics?.stayInCamp || 0} icon={FileText} accent="green" />
        <StatCard label="Junior Camp" value={analytics?.juniorCamp || 0} icon={FileText} accent="amber" />
        <StatCard label="Male" value={analytics?.male || 0} icon={FileText} accent="amber" />
        <StatCard label="Female" value={analytics?.female || 0} icon={FileText} accent="rose" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:flex-1">
            <Input label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, phone, ID" />
            <Select label="Filter by gender" value={gender} onChange={(e) => setGender(e.target.value)} options={genderOptions} />
            <Select label="Filter by camp type" value={campType} onChange={(e) => setCampType(e.target.value)} options={campTypeOptions} />
            <Select label="Sort by" value={sortValue} onChange={(e) => setSortValue(e.target.value)} options={sortOptions} />
          </div>
        </div>
      </div>

      <RegistrationsTable
        data={registrations}
        onView={(row) => navigate(`/admin/registrations/${row._id}`)}
        onDelete={(row) => setDeleteTarget(row)}
        onPrint={handlePrint}
        onDownload={handleDownloadPdf}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {registrations.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-400">
          No registrations found.
        </div>
      )}

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete registration"
        danger
        confirmText="Delete"
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      >
        This will permanently remove <strong>{deleteTarget?.fullName}</strong> and associated files.
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
