const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const env = require("../config/env");

const ensureAdminSeed = async () => {
  const username = String(env.adminUsername).toLowerCase();
  const email = String(env.adminEmail).toLowerCase();
  const password = await bcrypt.hash(env.adminPassword, 12);
  const camperUsername = String(env.camperUsername).toLowerCase();
  const camperEmail = String(env.camperEmail).toLowerCase();
  const camperPassword = await bcrypt.hash(env.camperPassword, 12);

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

  const camper = await Admin.findOneAndUpdate(
    { role: "camper" },
    {
      $set: {
        name: "Camper Portal",
        username: camperUsername,
        email: camperEmail,
        password: camperPassword,
        role: "camper",
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
  console.log(`Camper synced: ${camper.username}`);
  return admin;
};

module.exports = { ensureAdminSeed };
