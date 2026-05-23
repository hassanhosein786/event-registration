import { useEffect, useState } from "react";
import { getCurrentAdmin } from "../services/authService";

export const useAuth = (tokenKey = "admin_token") => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentAdmin()
      .then((data) => setAdmin(data.admin))
      .catch(() => {
        localStorage.removeItem(tokenKey);
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, [tokenKey]);

  return { admin, setAdmin, loading };
};
