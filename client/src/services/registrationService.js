import api from "./api";

export const submitRegistration = async (formData) => {
  const { data } = await api.post("/api/registrations", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const fetchRegistrations = async (params = {}) => {
  const { data } = await api.get("/api/registrations", { params });
  return data;
};

export const fetchRegistrationSummary = async () => {
  const { data } = await api.get("/api/registrations/summary");
  return data;
};

export const fetchRegistration = async (id) => {
  const { data } = await api.get(`/api/registrations/${id}`);
  return data;
};

export const fetchPublicRegistration = async (registrationId) => {
  const { data } = await api.get(`/api/registrations/public/${registrationId}`);
  return data;
};

export const fetchVerification = async (registrationId) => {
  const { data } = await api.get(`/api/registrations/verify/${registrationId}`);
  return data;
};

export const deleteRegistration = async (id) => {
  const { data } = await api.delete(`/api/registrations/${id}`);
  return data;
};

export const exportCsv = (params = {}) => api.get("/api/export/csv", { responseType: "blob", params });

export const mergeAllPdfs = (params = {}) => api.get("/api/export/pdf/merge", { responseType: "blob", params });

export const fetchAnalytics = async () => {
  const { data } = await api.get("/api/export/analytics");
  return data;
};
