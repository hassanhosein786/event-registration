const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const Admin = require("../models/Admin");
const env = require("../config/env");

const signToken = (admin) =>
  jwt.sign({ id: admin._id, role: admin.role, email: admin.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: String(email).toLowerCase() }).select("+password");

  if (!admin || !admin.isActive) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: signToken(admin),
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

module.exports = { loginAdmin, me };
