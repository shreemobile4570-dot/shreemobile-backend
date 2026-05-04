const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifiedTokenCache = new Map();
const AUTH_CACHE_TTL_MS = 60 * 1000;

const getCachedUser = (token) => {
  const cached = verifiedTokenCache.get(token);
  if (!cached || cached.expiresAt < Date.now()) {
    verifiedTokenCache.delete(token);
    return null;
  }
  return cached.user;
};

const setCachedUser = (token, decoded, user) => {
  const jwtExpiresAt = decoded?.exp ? decoded.exp * 1000 : Date.now() + AUTH_CACHE_TTL_MS;
  verifiedTokenCache.set(token, {
    user,
    expiresAt: Math.min(Date.now() + AUTH_CACHE_TTL_MS, jwtExpiresAt),
  });
};

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const cachedUser = getCachedUser(token);
        if (cachedUser) {
          req.user = cachedUser;
          return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id)
          .select("_id email role isBlocked")
          .lean();
        if (!user || user.isBlocked) {
          throw new Error("Not Authorized");
        }

        req.user = user;
        setCachedUser(token, decoded, user);
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired,Please Login again");
    }
  } else {
    throw new Error("THere is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== "admin") {
    throw new Error("Your are not an admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
