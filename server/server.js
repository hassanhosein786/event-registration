const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");
const { ensureAdminSeed } = require("./data/seedAdmins");

const start = async () => {
  await connectDB();
  await ensureAdminSeed();

  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${env.port} is already in use. Stop the other server instance or change PORT in server/.env.`);
      process.exit(1);
    }

    throw error;
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
