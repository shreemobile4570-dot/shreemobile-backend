const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryUploadBuffer,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  try {
    console.log("Upload started - files:", req.files?.length);
    
    const uploader = async (file) => {
      console.log("Processing file:", file.originalname, file.mimetype);
      
      // Handle memory storage (Vercel)
      if (file.buffer) {
        return await cloudinaryUploadBuffer(file.buffer);
      }
      // Handle disk storage (local)
      else if (file.path) {
        return await cloudinaryUploadImg(file.path);
      }
      throw new Error("No file data available");
    };

    const urls = [];

    for (const file of req.files) {
      const newpath = await uploader(file);
      console.log("Uploaded:", newpath.url);
      urls.push(newpath);

      // Cleanup temp file only if it exists (local development)
      if (file.path) {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkErr) {
          console.error("Failed to delete temp file:", unlinkErr);
        }
      }
    }

    res.json(urls);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};
