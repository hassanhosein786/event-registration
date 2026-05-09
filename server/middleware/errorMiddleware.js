const env = require("../config/env");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || "Server error";

  const payload = {
    message,
    stack: env.nodeEnv === "production" ? undefined : err.stack
  };

  if (err.name === "MongoServerError" && err.code === 11000) {
    payload.message = "Duplicate registration or record already exists.";
    res.status(409).json(payload);
    return;
  }

  if (err.name === "ValidationError") {
    res.status(400).json({ message: err.message });
    return;
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json({ message: "Invalid authentication token" });
    return;
  }

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;
