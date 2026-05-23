import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Input from "../components/Input";
import { loginAdmin } from "../services/authService";
import { loginSchema } from "../utils/validators";

const CamperLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm((current) => ({ ...current, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const nextErrors = {};
      result.error.issues.forEach((issue) => {
        nextErrors[issue.path[0]] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await loginAdmin(form);
      if (response.admin?.role !== "camper") {
        toast.error("Use camper credentials");
        return;
      }

      localStorage.removeItem("admin_token");
      localStorage.removeItem("camper_token");
      localStorage.setItem("camper_token", response.token);
      toast.success("Welcome to camper lookup");
      window.location.replace("/campers");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-200">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">Camper Login</h1>
          <p className="mt-2 text-sm text-slate-400">Read-only access for camper records only.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" value={form.username} onChange={handleChange("username")} error={errors.username} />
          <Input label="Password" type="password" value={form.password} onChange={handleChange("password")} error={errors.password} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CamperLoginPage;
