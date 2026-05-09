import api from "./api";

export const loginAdmin = async (payload) => {
  const { data } = await api.post("/api/auth/login", payload);
  return data;
};

export const getCurrentAdmin = async () => {
  const { data } = await api.get("/api/auth/me");
  return data;
};
