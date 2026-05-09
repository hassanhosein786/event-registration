const slugify = require("slugify");
const Counter = require("../models/Counter");

const generateRegistrationId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "registrationId" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return String(counter.value);
};

const sanitizeFileName = (value) =>
  slugify(String(value || "registration"), {
    lower: true,
    strict: true,
    trim: true
  });

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

module.exports = {
  generateRegistrationId,
  sanitizeFileName,
  calculateAge
};
