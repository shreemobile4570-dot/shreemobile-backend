// const multer = require("multer");
// const sharp = require("sharp");


// const path = require("path");
// const fs = require("fs");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../public/images/"));
//   },
//   filename: function (req, file, cb) {
//     const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
//   },
// });

// const storage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb({ message: "Unsupported file format" }, false);
//   }
// };

// const uploadPhoto = multer({
//   storage: storage,
//   fileFilter: multerFilter,
//   limits: { fileSize: 1000000 },
// });

// const productImgResize = async (req, res, next) => {
//   if (!req.files) return next();
//   await Promise.all(
//     req.files.map(async (file) => {
//       await sharp(file.path)
//         .resize(300, 300)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/images/products/${file.filename}`);
//       fs.unlinkSync(`public/images/products/${file.filename}`);
//     })
//   );
//   next();
// };
// //push restart
// const blogImgResize = async (req, res, next) => {
//   if (!req.files) return next();
//   await Promise.all(
//     req.files.map(async (file) => {
//       await sharp(file.path)
//         .resize(300, 300)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/images/blogs/${file.filename}`);
//       fs.unlinkSync(`public/images/blogs/${file.filename}`);
//     })
//   );
//   next();
// };
// module.exports = { uploadPhoto, productImgResize, blogImgResize };

const multer = require("multer");
const sharp = require("sharp");
const { cloudinaryUploadImg } = require("../utils/cloudinary");

// ✅ memory storage (no filesystem)
const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

// ✅ PRODUCT IMAGE
const productImgResize = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
    const images = await Promise.all(
      req.files.map(async (file) => {
        const buffer = await sharp(file.buffer)
          .resize(300, 300)
          .jpeg({ quality: 90 })
          .toBuffer();

        const result = await cloudinaryUploadImg(buffer, "products");

        return result;
      })
    );

    req.body.images = images;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ BLOG IMAGE
const blogImgResize = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
    const images = await Promise.all(
      req.files.map(async (file) => {
        const buffer = await sharp(file.buffer)
          .resize(300, 300)
          .jpeg({ quality: 90 })
          .toBuffer();

        const result = await cloudinaryUploadImg(buffer, "blogs");

        return result;
      })
    );

    req.body.images = images;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };