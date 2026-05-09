import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = forwardRef(function SignaturePad({ error }, ref) {
  const innerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clear: () => innerRef.current?.clear(),
    isEmpty: () => innerRef.current?.isEmpty(),
    toDataURL: () => innerRef.current?.getTrimmedCanvas().toDataURL("image/png")
  }));

  useEffect(() => {
    const resize = () => innerRef.current?.clear();
    window.addEventListener("orientationchange", resize);
    return () => window.removeEventListener("orientationchange", resize);
  }, []);

  return (
    <div className="space-y-2">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-3">
        <SignatureCanvas
          ref={innerRef}
          canvasProps={{
            className: "h-56 w-full rounded-2xl bg-white"
          }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Draw your signature with mouse, finger, or stylus.</span>
        <button
          type="button"
          onClick={() => innerRef.current?.clear()}
          className="rounded-full border border-white/10 px-3 py-1 text-slate-300 hover:bg-white/5"
        >
          Clear
        </button>
      </div>
      {error && <div className="text-xs text-rose-300">{error}</div>}
    </div>
  );
});

export default SignaturePad;
