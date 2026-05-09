import { useEffect, useState } from "react";
import { getCurrentAdmin } from "../services/authService";

export const useAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentAdmin()
      .then((data) => setAdmin(data.admin))
      .catch(() => {
        localStorage.removeItem("admin_token");
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { admin, setAdmin, loading };
};
