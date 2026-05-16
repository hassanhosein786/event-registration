const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const env = require("../config/env");

const ensureAdminSeed = async () => {
  const username = String(env.adminUsername).toLowerCase();
  const email = String(env.adminEmail).toLowerCase();
  const password = await bcrypt.hash(env.adminPassword, 12);
  const admin = await Admin.findOneAndUpdate(
    { role: "superadmin" },
    {
      $set: {
        name: "System Admin",
        username,
        email,
        password,
        role: "superadmin",
        isActive: true
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  console.log(`Admin synced: ${admin.username}`);
  return admin;
};

module.exports = { ensureAdminSeed };
