const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const styles = {
    primary: "bg-brand-500 text-white hover:bg-brand-400 shadow-glow",
    secondary: "bg-white/5 text-slate-100 hover:bg-white/10",
    danger: "bg-rose-500 text-white hover:bg-rose-400",
    outline: "border border-white/10 bg-transparent text-slate-100 hover:bg-white/5"
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
