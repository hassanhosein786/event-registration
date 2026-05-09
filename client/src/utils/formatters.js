export const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
};

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "-";
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "-";
  const ageDiff = Date.now() - dob.getTime();
  return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
};
