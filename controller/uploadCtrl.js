const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
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
    const uploader = async (file) => {
      // Handle both memory buffer (Vercel) and file path (local)
      if (file.buffer) {
        // Memory storage - upload directly from buffer
        return await cloudinaryUploadImg(`data:image/jpeg;base64,${file.buffer.toString("base64")}`);
      } else if (file.path) {
        // Disk storage - upload from file path
        return await cloudinaryUploadImg(file.path);
      }
    };

    const urls = [];
    console.log("Files received:", req.files);

    for (const file of req.files) {
      const newpath = await uploader(file);
      console.log("Uploaded:", newpath);
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
