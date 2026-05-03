const mongoose = require("mongoose");

const dbConnect = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    if (
      !process.env.MONGODB_URL ||
      process.env.MONGODB_URL.includes("<username>") ||
      process.env.MONGODB_URL.includes("<password>")
    ) {
      throw new Error("MONGODB_URL is missing or still contains placeholder values");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

module.exports = dbConnect;
