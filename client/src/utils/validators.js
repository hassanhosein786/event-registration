import { z } from "zod";

export const registrationSchema = z.object({
  campType: z.string().refine((value) => ["junior-camp", "stay-in-camp"].includes(value), "Camp type is required"),
  fullName: z.string().min(2, "Full name is required"),
  school: z.string().min(2, "School is required"),
  classLevel: z.string().min(1, "Class level is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Enter a valid email"),
  parentGuardianName: z.string().min(3, "Parent/guardian name is required"),
  parentGuardianRelationship: z.string().min(2, "Relationship is required"),
  parentGuardianContactNumber: z.string().min(7, "Contact number is required"),
  medicalConditions: z.string().optional(),
  guardianInfo: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  consentAccepted: z.boolean().refine(Boolean, "Consent is required")
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is required")
});
