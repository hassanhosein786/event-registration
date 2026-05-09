const path = require("path");
const { stringify } = require("csv-stringify/sync");
const asyncHandler = require("../middleware/asyncHandler");
const Registration = require("../models/Registration");
const { mergePdfFiles } = require("../services/pdfService");
const { pdfsDir } = require("../utils/filePaths");

const formatCampType = (value) => {
  if (value === "junior-camp") return "Junior Camp";
  if (value === "stay-in-camp") return "Stay in Camp";
  return value || "";
};

const formatParentGuardianContact = (contact) => {
  if (!contact) return "";
  return [contact.name, contact.relationship, contact.contactNumber].filter(Boolean).join(" | ");
};

const exportCsv = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({}).sort({ createdAt: -1 }).lean();
  const rows = registrations.map((item) => ({
    registrationId: item.registrationId,
    eventId: item.eventId,
    campType: formatCampType(item.campType),
    fullName: item.fullName,
    school: item.school,
    classLevel: item.classLevel,
    dateOfBirth: item.dateOfBirth ? new Date(item.dateOfBirth).toISOString().slice(0, 10) : "",
    gender: item.gender,
    address: item.address,
    phone: item.phone,
    email: item.email,
    parentGuardianContact: formatParentGuardianContact(item.parentGuardianContact),
    medicalConditions: item.medicalConditions,
    guardianInfo: item.guardianInfo,
    consentAccepted: item.consentAccepted ? "Yes" : "No",
    submittedAt: item.submittedAt
  }));

  const csv = stringify(rows, { header: true });
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="registrations.csv"');
  res.send(csv);
});

const mergeAllPdfs = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ generatedPdf: { $ne: "" } }).sort({ createdAt: -1 }).lean();
  const filePaths = registrations.map((item) => path.join(__dirname, "..", "public", item.generatedPdf.replace(/^\//, "")));
  const merged = await mergePdfFiles(filePaths, "merged-registrations.pdf");
  res.download(merged.absolutePath, "merged-registrations.pdf");
});

const printAllRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({}).sort({ createdAt: -1 }).lean();
  res.json({ data: registrations });
});

const exportAnalytics = asyncHandler(async (req, res) => {
  const [total, male, female, other, recent] = await Promise.all([
    Registration.countDocuments(),
    Registration.countDocuments({ gender: "male" }),
    Registration.countDocuments({ gender: "female" }),
    Registration.countDocuments({ gender: "other" }),
    Registration.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
  ]);

  res.json({
    data: {
      total,
      male,
      female,
      other,
      recent
    }
  });
});

module.exports = {
  exportCsv,
  mergeAllPdfs,
  printAllRegistrations,
  exportAnalytics
};
