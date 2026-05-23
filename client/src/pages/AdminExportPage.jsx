import { useState } from "react";
import { Archive, Download, Printer, FileText } from "lucide-react";
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

  const handleExportCsv = async (campType = "") => {
    setLoading(true);
    try {
      const response = await exportCsv(campType ? { campType } : {});
      const fileName = campType === "junior-camp"
        ? "junior-camp-registrations.csv"
        : campType === "stay-in-camp"
          ? "stay-in-camp-registrations.csv"
          : "registrations.csv";
      downloadBlob(new Blob([response.data], { type: "text/csv" }), fileName);
      toast.success("CSV exported");
    } catch (error) {
      toast.error(error?.response?.data?.message || "CSV export failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async (campType = "") => {
    setLoading(true);
    try {
      const response = await mergeAllPdfs(campType ? { campType } : {});
      const fileName = campType === "junior-camp"
        ? "junior-camp-merged-registrations.pdf"
        : campType === "stay-in-camp"
          ? "stay-in-camp-merged-registrations.pdf"
          : "merged-registrations.pdf";
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
          description="Download a spreadsheet-friendly registration export."
          actionLabel="Download CSV"
          onAction={() => handleExportCsv()}
          loading={loading}
        />
        <ActionCard
          icon={FileText}
          title="Merge PDFs"
          description="Create one combined PDF for all registrations."
          actionLabel="Download merged PDF"
          onAction={() => handleMerge()}
          loading={loading}
        />
        <ActionCard
          icon={Printer}
          title="Print all"
          description="Use the print view to generate paper copies."
          actionLabel="Open print view"
          onAction={() => window.open("/admin/print", "_blank")}
          loading={false}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActionCard
          icon={Download}
          title="CSV by camp"
          description="Export only one camp group into a separate CSV file."
          actionLabel="Junior Camp CSV"
          onAction={() => handleExportCsv("junior-camp")}
          loading={loading}
        />
        <ActionCard
          icon={Download}
          title="CSV by camp"
          description="Export only one camp group into a separate CSV file."
          actionLabel="Stay in Camp CSV"
          onAction={() => handleExportCsv("stay-in-camp")}
          loading={loading}
        />
        <ActionCard
          icon={FileText}
          title="Merge PDFs by camp"
          description="Download one combined PDF for a single camp group."
          actionLabel="Junior Camp PDF"
          onAction={() => handleMerge("junior-camp")}
          loading={loading}
        />
        <ActionCard
          icon={FileText}
          title="Merge PDFs by camp"
          description="Download one combined PDF for a single camp group."
          actionLabel="Stay in Camp PDF"
          onAction={() => handleMerge("stay-in-camp")}
          loading={loading}
        />
      </div>
    </div>
  );
};

const ActionCard = ({ icon: Icon, title, description, actionLabel, onAction, loading }) => (
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
    <div className="mt-5">
      <Button onClick={onAction} disabled={loading}>
        {actionLabel}
      </Button>
    </div>
  </div>
);

export default AdminExportPage;
