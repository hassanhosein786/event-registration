const express = require("express");
const { loginAdmin, me } = require("../controllers/authController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, me);

module.exports = router;
