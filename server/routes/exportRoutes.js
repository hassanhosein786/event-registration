const express = require("express");
const { protectAdmin, allowRoles } = require("../middleware/authMiddleware");
const { exportCsv, mergeAllPdfs, printAllRegistrations, exportAnalytics } = require("../controllers/exportController");

const router = express.Router();

router.use(protectAdmin);

router.get("/csv", exportCsv);
router.get("/pdf/merge", mergeAllPdfs);
router.get("/print", printAllRegistrations);
router.get("/analytics", exportAnalytics);
router.get("/settings", allowRoles("superadmin"), (req, res) => {
  res.json({ message: "Superadmin settings access granted" });
});

module.exports = router;
