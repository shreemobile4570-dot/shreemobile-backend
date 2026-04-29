const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Use memory storage for Vercel compatibility (read-only filesystem)
const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

// For local development only - skip on Vercel
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  
  // Check if we're in production (Vercel) - skip sharp processing
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return next();
  }
  
  // Only run sharp on local development
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.buffer)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
    })
  );
  next();
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  
  // Check if we're in production (Vercel) - skip sharp processing
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return next();
  }
  
  // Only run sharp on local development
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.buffer)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
    })
  );
  next();
};
module.exports = { uploadPhoto, productImgResize, blogImgResize };
