const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

let connectionPromise = null;

const dbConnect = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  try {
    if (
      !process.env.MONGODB_URL ||
      process.env.MONGODB_URL.includes("<username>") ||
      process.env.MONGODB_URL.includes("<password>")
    ) {
      throw new Error("MONGODB_URL is missing or still contains placeholder values");
    }

    connectionPromise = mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      maxPoolSize: 10,
    });
    const conn = await connectionPromise;
    console.log(`Database Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    connectionPromise = null;
    console.error("Database connection error:", error.message);
    throw error;
  }
};

module.exports = dbConnect;
