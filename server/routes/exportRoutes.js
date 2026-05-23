const express = require("express");
const { protectAdmin, allowRoles } = require("../middleware/authMiddleware");
const { exportCsv, mergeAllPdfs, printAllRegistrations, exportAnalytics } = require("../controllers/exportController");

const router = express.Router();

router.use(protectAdmin, allowRoles("admin", "superadmin"));

router.get("/csv", exportCsv);
router.get("/pdf/merge", mergeAllPdfs);
router.get("/print", printAllRegistrations);
router.get("/analytics", exportAnalytics);
module.exports = router;
