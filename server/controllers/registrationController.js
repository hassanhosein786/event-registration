const fs = require("fs/promises");
const path = require("path");
const asyncHandler = require("../middleware/asyncHandler");
const Registration = require("../models/Registration");
const { generateRegistrationId, calculateAge } = require("../utils/registration");
const { createRegistrationPdf } = require("../services/pdfService");
const { sendRegistrationConfirmation } = require("../services/emailService");
const { toPublicPath } = require("../utils/filePaths");
const env = require("../config/env");

const registrationInputFields = {
  campType: (value) => String(value || "").trim(),
  fullName: (value) => String(value || "").trim(),
  school: (value) => String(value || "").trim(),
  classLevel: (value) => String(value || "").trim(),
  dateOfBirth: (value) => value,
  gender: (value) => String(value || "").trim(),
  address: (value) => String(value || "").trim(),
  phone: (value) => String(value || "").trim(),
  email: (value) => String(value || "").trim().toLowerCase(),
  parentGuardianName: (value) => String(value || "").trim(),
  parentGuardianRelationship: (value) => String(value || "").trim(),
  parentGuardianContactNumber: (value) => String(value || "").trim(),
  medicalConditions: (value) => String(value || "").trim(),
  guardianInfo: (value) => String(value || "").trim(),
  consentAccepted: (value) => value === true || value === "true",
  emailConfirmationRequested: (value) => value === true || value === "true"
};

const validateRegistrationPayload = (body) => {
  const errors = [];
  const required = [
    "campType",
    "fullName",
    "school",
    "classLevel",
    "dateOfBirth",
    "gender",
    "address",
    "phone",
    "email",
    "parentGuardianName",
    "parentGuardianRelationship",
    "parentGuardianContactNumber",
    "consentAccepted"
  ];

  for (const field of required) {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === "") {
      errors.push(`${field} is required`);
    }
  }

  if (body.consentAccepted !== true && body.consentAccepted !== "true") {
    errors.push("consentAccepted must be checked");
  }

  if (body.honeypot && String(body.honeypot).trim() !== "") {
    errors.push("spam detected");
  }

  return errors;
};

const verifyTurnstile = async (token, ip) => {
  if (!env.turnstileSecret) return true;
  if (!token) return false;

  const form = new URLSearchParams();
  form.append("secret", env.turnstileSecret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form
  });
  const data = await response.json();
  return Boolean(data.success);
};

const createRegistration = asyncHandler(async (req, res) => {
  const errors = validateRegistrationPayload(req.body);
  if (errors.length) {
    return res.status(400).json({ message: errors[0], errors });
  }

  const turnstileToken = req.body.turnstileToken || req.body["cf-turnstile-response"];
  const turnstileOk = await verifyTurnstile(turnstileToken, req.ip);
  if (!turnstileOk) {
    return res.status(400).json({ message: "Security verification failed" });
  }

  const eventId = String(req.body.eventId || "default-event").trim();
  const eventName = String(req.body.eventName || "Montrose Muslim Association Islamic Summer Camp 2026").trim();
  const campType = registrationInputFields.campType(req.body.campType);
  const fullName = registrationInputFields.fullName(req.body.fullName);
  const school = registrationInputFields.school(req.body.school);
  const classLevel = registrationInputFields.classLevel(req.body.classLevel);
  const dateOfBirth = new Date(req.body.dateOfBirth);
  const age = calculateAge(dateOfBirth);
  const gender = registrationInputFields.gender(req.body.gender);
  const address = registrationInputFields.address(req.body.address);
  const phone = registrationInputFields.phone(req.body.phone);
  const email = registrationInputFields.email(req.body.email);
  const parentGuardianContact = {
    name: registrationInputFields.parentGuardianName(req.body.parentGuardianName),
    relationship: registrationInputFields.parentGuardianRelationship(req.body.parentGuardianRelationship),
    contactNumber: registrationInputFields.parentGuardianContactNumber(req.body.parentGuardianContactNumber)
  };
  const medicalConditions = registrationInputFields.medicalConditions(req.body.medicalConditions);
  const guardianInfo = registrationInputFields.guardianInfo(req.body.guardianInfo);
  const consentAccepted = registrationInputFields.consentAccepted(req.body.consentAccepted);
  const emailConfirmationRequested = registrationInputFields.emailConfirmationRequested(req.body.emailConfirmationRequested);
  const selectedDate = req.body.date ? new Date(req.body.date) : new Date();

  if (!["junior-camp", "stay-in-camp"].includes(campType)) {
    return res.status(400).json({ message: "campType is invalid" });
  }

  if (Number.isNaN(dateOfBirth.getTime())) {
    return res.status(400).json({ message: "dateOfBirth is invalid" });
  }

  if (Number.isNaN(selectedDate.getTime())) {
    return res.status(400).json({ message: "date is invalid" });
  }

  const registrationId = await generateRegistrationId();

  const attachments = Array.isArray(req.files)
    ? req.files.map((file) => ({
        originalName: file.originalname,
        fileName: file.filename,
        filePath: toPublicPath(file.path),
        mimeType: file.mimetype,
        size: file.size
      }))
    : [];

  const registration = await Registration.create({
    registrationId,
    eventId,
    eventName,
    campType,
    fullName,
    school,
    classLevel,
    dateOfBirth,
    age,
    gender,
    address,
    phone,
    email,
    parentGuardianContact,
    medicalConditions,
    guardianInfo,
    consentAccepted,
    emailConfirmationRequested,
    selectedDate,
    signatureImage: "",
    generatedPdf: "",
    attachments,
    submittedAt: new Date()
  });

  const pdfResult = await createRegistrationPdf(registration);

  registration.generatedPdf = pdfResult.publicPath;
  await registration.save();

  if (registration.emailConfirmationRequested) {
    sendRegistrationConfirmation(registration).catch((error) => {
      console.warn("Email confirmation skipped:", error.message);
    });
  }

  res.status(201).json({
    message: "Registration submitted successfully",
    data: registration
  });
});

const getRegistrations = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
  const search = String(req.query.search || "").trim();
  const gender = String(req.query.gender || "").trim();
  const campType = String(req.query.campType || "").trim();
  const sortBy = String(req.query.sortBy || "submittedAt").trim();
  const order = String(req.query.order || "desc").trim() === "asc" ? 1 : -1;
  const eventId = String(req.query.eventId || "").trim();

  const filter = {};
  if (eventId) filter.eventId = eventId;
  if (gender) filter.gender = gender;
  if (campType) filter.campType = campType;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { registrationId: { $regex: search, $options: "i" } }
    ];
  }

  const allowedSort = ["submittedAt", "fullName", "gender", "dateOfBirth"];
  const sortField = allowedSort.includes(sortBy) ? sortBy : "submittedAt";

  const [items, total] = await Promise.all([
    Registration.find(filter)
      .sort({ [sortField]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Registration.countDocuments(filter)
  ]);

  res.json({
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    }
  });
});

const getRegistrationById = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id).lean();
  if (!registration) {
    return res.status(404).json({ message: "Registration not found" });
  }
  res.json({ data: registration });
});

const getRegistrationByPublicId = asyncHandler(async (req, res) => {
  const registration = await Registration.findOne({ registrationId: req.params.registrationId }).lean();
  if (!registration) {
    return res.status(404).json({ message: "Registration not found" });
  }
  res.json({
    data: {
      registrationId: registration.registrationId,
      fullName: registration.fullName,
      eventId: registration.eventId,
      campType: registration.campType,
      submittedAt: registration.submittedAt,
      createdAt: registration.createdAt,
      signatureImage: registration.signatureImage,
      generatedPdf: registration.generatedPdf
    }
  });
});

const deleteRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);
  if (!registration) {
    return res.status(404).json({ message: "Registration not found" });
  }

  const removeIfExists = async (relativePath) => {
    if (!relativePath) return;
    const absolutePath = path.join(__dirname, "..", "public", relativePath.replace(/^\//, ""));
    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      void error;
    }
  };

  await Promise.all([
    removeIfExists(registration.signatureImage),
    removeIfExists(registration.generatedPdf),
    ...registration.attachments.map((attachment) => removeIfExists(attachment.filePath))
  ]);

  await registration.deleteOne();
  res.json({ message: "Registration deleted successfully" });
});

const getPublicVerification = asyncHandler(async (req, res) => {
  const registration = await Registration.findOne({ registrationId: req.params.registrationId }).lean();
  if (!registration) return res.status(404).json({ message: "Not found" });

  res.json({
    data: {
      registrationId: registration.registrationId,
      fullName: registration.fullName,
      school: registration.school,
      classLevel: registration.classLevel,
      submittedAt: registration.submittedAt,
      age: calculateAge(registration.dateOfBirth),
      eventName: registration.eventName || "Montrose Muslim Association Islamic Summer Camp 2026",
      parentGuardianContact: registration.parentGuardianContact,
      campType: registration.campType
    }
  });
});

module.exports = {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  getRegistrationByPublicId,
  deleteRegistration,
  getPublicVerification
};
