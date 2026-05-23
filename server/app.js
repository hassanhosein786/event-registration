const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs/promises");
const asyncHandler = require("./middleware/asyncHandler");
const env = require("./config/env");
const Registration = require("./models/Registration");
const { ensureRegistrationPdf } = require("./services/registrationPdfService");
const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const exportRoutes = require("./routes/exportRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
const allowedOrigins = env.clientUrl
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const originAllowed = (origin) =>
  allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === "*") return true;
    if (allowedOrigin.includes("*")) {
      const pattern = `^${escapeRegex(allowedOrigin).replace(/\\\*/g, ".*")}$`;
      return new RegExp(pattern).test(origin);
    }
    return allowedOrigin === origin;
  }) ||
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(origin);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || originAllowed(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
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

app.get(
  "/uploads/pdfs/:fileName",
  asyncHandler(async (req, res) => {
    const fileName = String(req.params.fileName || "").trim();
    const registrationId = fileName.replace(/\.pdf$/i, "");

    const registration = await Registration.findOne({ registrationId }).lean(false);
    if (!registration) {
      return res.status(404).json({ message: `Not found - /uploads/pdfs/${fileName}` });
    }

    const pdfInfo = await ensureRegistrationPdf(registration);
    if (pdfInfo.regenerated) {
      registration.generatedPdf = pdfInfo.publicPath;
      await registration.save();
    }

    try {
      await fs.access(pdfInfo.absolutePath);
      return res.sendFile(pdfInfo.absolutePath);
    } catch (error) {
      void error;
      return res.status(404).json({ message: `Not found - /uploads/pdfs/${fileName}` });
    }
  })
);

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/export", exportRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
