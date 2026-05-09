const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");
const { ensureAdminSeed } = require("./data/seedAdmins");

const start = async () => {
  await connectDB();
  await ensureAdminSeed();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
