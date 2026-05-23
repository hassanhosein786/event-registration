import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { mergeAllPdfs } from "../services/registrationService";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";

const PrintAllPage = () => {
  const [state, setState] = useState({ loading: true, pdfUrl: "" });

  useEffect(() => {
    let active = true;
    let objectUrl = "";

    mergeAllPdfs()
      .then((response) => {
        objectUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        if (active) {
          setState({ loading: false, pdfUrl: objectUrl });
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Failed to generate merged PDF");
        if (active) {
          setState({ loading: false, pdfUrl: "" });
        }
      });

    return () => {
      active = false;
      if (objectUrl) window.URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const pdfSrc = useMemo(() => state.pdfUrl, [state.pdfUrl]);

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

  if (state.loading) return <LoadingSpinner label="Preparing merged PDF..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">Merged registration PDF</h2>
            <p className="text-sm text-slate-400">All registration forms are combined into one printable PDF.</p>
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
            title="Merged registration PDF"
            src={pdfSrc}
            className="h-[80vh] w-full rounded-2xl border-0 bg-white"
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-slate-400">
            No merged PDF available.
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintAllPage;
