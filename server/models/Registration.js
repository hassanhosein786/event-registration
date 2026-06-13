const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    originalName: String,
    fileName: String,
    filePath: String,
    mimeType: String,
    size: Number
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    registrationId: { type: String, required: true, unique: true, index: true },
    eventId: { type: String, required: true, index: true },
    eventName: { type: String, default: "" },
    campType: { type: String, required: true, enum: ["junior-camp", "stay-in-camp"] },
    fullName: { type: String, required: true, trim: true },
    school: { type: String, required: true, trim: true },
    classLevel: { type: String, required: true, trim: true },
    jerseySize: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, default: null },
    gender: { type: String, required: true, enum: ["male", "female", "other", "prefer-not-to-say"] },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    parentGuardianContact: {
      name: { type: String, required: true, trim: true },
      relationship: { type: String, required: true, trim: true },
      contactNumber: { type: String, required: true, trim: true }
    },
    medicalConditions: { type: String, default: "" },
    guardianInfo: { type: String, default: "" },
    consentAccepted: { type: Boolean, required: true, default: false },
    consentRulesAccepted: { type: Boolean, required: true, default: false },
    emailConfirmationRequested: { type: Boolean, default: false },
    selectedDate: { type: Date, default: Date.now },
    signatureImage: { type: String, default: "" },
    generatedPdf: { type: String, default: "" },
    attachments: { type: [attachmentSchema], default: [] },
    submittedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

registrationSchema.index({ fullName: "text", email: "text", phone: "text", registrationId: "text" });

module.exports = mongoose.model("Registration", registrationSchema);
