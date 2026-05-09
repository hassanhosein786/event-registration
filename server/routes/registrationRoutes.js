const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  getRegistrationByPublicId,
  deleteRegistration,
  getPublicVerification
} = require("../controllers/registrationController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", upload.array("attachments", 4), createRegistration);
router.get("/", protectAdmin, getRegistrations);
router.get("/verify/:registrationId", getPublicVerification);
router.get("/public/:registrationId", getRegistrationByPublicId);
router.get("/:id", protectAdmin, getRegistrationById);
router.delete("/:id", protectAdmin, deleteRegistration);

module.exports = router;
