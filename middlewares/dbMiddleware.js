const dbConnect = require("../config/dbConnect");

const ensureDbConnected = async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    res.status(503);
    next(new Error("Database is not connected. Please try again in a moment."));
  }
};

module.exports = ensureDbConnected;
