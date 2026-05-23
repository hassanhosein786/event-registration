const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
  createRegistration,
  getRegistrations,
  getRegistrationSummary,
  getRegistrationById,
  getRegistrationByPublicId,
  deleteRegistration,
  getPublicVerification
} = require("../controllers/registrationController");
const { protectAdmin, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", upload.array("attachments", 4), createRegistration);
router.get("/", protectAdmin, allowRoles("admin", "superadmin", "camper"), getRegistrations);
router.get("/summary", protectAdmin, allowRoles("admin", "superadmin", "camper"), getRegistrationSummary);
router.get("/verify/:registrationId", getPublicVerification);
router.get("/public/:registrationId", getRegistrationByPublicId);
router.get("/:id", protectAdmin, allowRoles("admin", "superadmin", "camper"), getRegistrationById);
router.delete("/:id", protectAdmin, allowRoles("admin", "superadmin"), deleteRegistration);

module.exports = router;
