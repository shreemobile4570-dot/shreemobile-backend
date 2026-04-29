const multer = require("multer");

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

// Skip image processing on Vercel - let controller handle it directly
const productImgResize = async (req, res, next) => {
  next();
};

const blogImgResize = async (req, res, next) => {
  next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
