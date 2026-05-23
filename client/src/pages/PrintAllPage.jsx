import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { mergeAllPdfs } from "../services/registrationService";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import { campTypeOptions } from "../utils/constants";

const campFilters = campTypeOptions.map((option) => ({
  label: option.label,
  value: option.value
}));

const PrintAllPage = () => {
  const [state, setState] = useState({ loading: false, pdfUrl: "", title: "" });

  const loadMergedPdf = async (campType) => {
    setState((current) => ({ ...current, loading: true }));

    try {
      const response = await mergeAllPdfs(campType ? { campType } : {});
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const title = campType === "junior-camp" ? "Junior Camp PDFs" : "Stay in Camp PDFs";
      setState({ loading: false, pdfUrl: blobUrl, title });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate merged PDF");
      setState((current) => ({ ...current, loading: false }));
    }
  };

  const handleOpen = () => {
    if (!state.pdfUrl) return;
    window.open(state.pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handlePrint = () => {
    if (!state.pdfUrl) return;
    const win = window.open(state.pdfUrl, "_blank", "noopener,noreferrer");
    if (!win) return;

    const onLoad = () => {
      win.focus();
      win.print();
    };

    if (win.document.readyState === "complete") {
      onLoad();
    } else {
      win.addEventListener("load", onLoad, { once: true });
    }
  };

  const pdfSrc = useMemo(() => state.pdfUrl, [state.pdfUrl]);

  if (state.loading && !state.pdfUrl) return <LoadingSpinner label="Preparing merged PDF..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Merged registration PDF</h2>
            <p className="text-sm text-slate-400">Choose which camp group to merge into a single printable PDF.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => loadMergedPdf("junior-camp")}>Merge Junior Camp PDFs</Button>
            <Button onClick={() => loadMergedPdf("stay-in-camp")}>Merge Stay in Camp PDFs</Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleOpen} disabled={!pdfSrc}>
              Open PDF
            </Button>
            <Button onClick={handlePrint} disabled={!pdfSrc}>
              Print Now
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3">
        {pdfSrc ? (
          <iframe
            title={state.title || "Merged registration PDF"}
            src={pdfSrc}
            className="h-[80vh] w-full rounded-2xl border-0 bg-white"
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-400">
            No merged PDF selected yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintAllPage;
