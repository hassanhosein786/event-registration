import { useState } from "react";
import { Archive, Download, FileText } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import { exportCsv, mergeAllPdfs } from "../services/registrationService";

const AdminExportPage = () => {
  const [loading, setLoading] = useState(false);

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportCsv = async (campType = "", gender = "") => {
    setLoading(true);
    try {
      const response = await exportCsv({
        ...(campType ? { campType } : {}),
        ...(gender ? { gender } : {})
      });
      const prefix = [
        campType === "junior-camp" ? "junior-camp" : campType === "stay-in-camp" ? "stay-in-camp" : "all-camps",
        gender === "male" ? "boys" : gender === "female" ? "girls" : "all"
      ].join("-");
      const fileName = `${prefix}-registrations.csv`;
      downloadBlob(new Blob([response.data], { type: "text/csv" }), fileName);
      toast.success("CSV exported");
    } catch (error) {
      toast.error(error?.response?.data?.message || "CSV export failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async (campType = "", gender = "") => {
    setLoading(true);
    try {
      const response = await mergeAllPdfs({
        ...(campType ? { campType } : {}),
        ...(gender ? { gender } : {})
      });
      const prefix = [
        campType === "junior-camp" ? "junior-camp" : campType === "stay-in-camp" ? "stay-in-camp" : "all-camps",
        gender === "male" ? "boys" : gender === "female" ? "girls" : "all"
      ].join("-");
      const fileName = `${prefix}-merged-registrations.pdf`;
      downloadBlob(new Blob([response.data], { type: "application/pdf" }), fileName);
      toast.success("Merged PDF downloaded");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Merge failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-500/20 p-3 text-brand-200">
            <Archive className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">Exports</h2>
            <p className="text-sm text-slate-400">Download data and documents from one place.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActionCard
          icon={Download}
          title="Export CSV"
          description="Download CSV exports split by camp and gender."
          actions={[
            { label: "Junior Boys CSV", onClick: () => handleExportCsv("junior-camp", "male") },
            { label: "Junior Girls CSV", onClick: () => handleExportCsv("junior-camp", "female") },
            { label: "Stay Boys CSV", onClick: () => handleExportCsv("stay-in-camp", "male") },
            { label: "Stay Girls CSV", onClick: () => handleExportCsv("stay-in-camp", "female") }
          ]}
          loading={loading}
        />
        <ActionCard
          icon={FileText}
          title="Merge PDFs"
          description="Create merged PDFs split by camp and gender."
          actions={[
            { label: "Junior Boys PDF", onClick: () => handleMerge("junior-camp", "male") },
            { label: "Junior Girls PDF", onClick: () => handleMerge("junior-camp", "female") },
            { label: "Stay Boys PDF", onClick: () => handleMerge("stay-in-camp", "male") },
            { label: "Stay Girls PDF", onClick: () => handleMerge("stay-in-camp", "female") }
          ]}
          loading={loading}
        />
      </div>
    </div>
  );
};

const ActionCard = ({ icon: Icon, title, description, actions, loading }) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-white/5 p-3 text-brand-200">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
    <div className="mt-5 flex flex-wrap gap-3">
      {actions.map((action) => (
        <Button key={action.label} onClick={action.onClick} disabled={loading}>
          {action.label}
        </Button>
      ))}
    </div>
  </div>
);

export default AdminExportPage;
