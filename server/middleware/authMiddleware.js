const jwt = require("jsonwebtoken");
const env = require("../config/env");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Admin token missing" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Admin account not available" });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const allowRoles = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = { protectAdmin, allowRoles };
