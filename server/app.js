const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const exportRoutes = require("./routes/exportRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(mongoSanitize());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "event-registration-api" });
});

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/export", exportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
