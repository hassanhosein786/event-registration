const mongoose = require("mongoose");
const env = require("./env");

const connectWithUri = async (uri, label) => {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
  });
  console.log(`${label} connected`);
};

const connectDB = async () => {
  try {
    await connectWithUri(env.mongoUri, "MongoDB");
  } catch (error) {
    const fallbackUri = "mongodb://127.0.0.1:27017/event_registration";
    if (env.nodeEnv !== "production" && env.mongoUri !== fallbackUri) {
      console.warn(`MongoDB Atlas connection failed, trying local MongoDB fallback: ${error.message}`);
      await connectWithUri(fallbackUri, "Local MongoDB");
      return;
    }

    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
