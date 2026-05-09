import { useEffect, useRef } from "react";

const SCRIPT_ID = "cloudflare-turnstile-script";

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      if (window.turnstile) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Turnstile")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.body.appendChild(script);
  });

const TurnstileWidget = ({ siteKey, onToken, onError }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return undefined;

    let mounted = true;
    const widgetOptions = {
      sitekey: siteKey,
      callback: (token) => onToken(token),
      "error-callback": () => onError?.("Security verification failed"),
      "expired-callback": () => onToken("")
    };

    loadScript("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit")
      .then(() => {
        if (!mounted || !window.turnstile || !containerRef.current) return;
        window.turnstile.render(containerRef.current, widgetOptions);
      })
      .catch((error) => onError?.(error.message));

    return () => {
      mounted = false;
    };
  }, [onError, onToken, siteKey]);

  if (!siteKey) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Security Check</div>
      <div className="mt-3" ref={containerRef} />
    </div>
  );
};

export default TurnstileWidget;
