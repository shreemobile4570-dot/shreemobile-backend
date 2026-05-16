// const cloudinary = require("cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.SECRET_KEY,
// });

// const cloudinaryUploadImg = async (fileToUploads) => {
//   return new Promise((resolve) => {
//     cloudinary.uploader.upload(fileToUploads, (result) => {
//       resolve(
//         {
//           url: result.secure_url,
//           asset_id: result.asset_id,
//           public_id: result.public_id,
//         },
//         {
//           resource_type: "auto",
//         }
//       );
//     });
//   });
// };


// const cloudinaryDeleteImg = async (fileToDelete) => {
//   return new Promise((resolve) => {
//     cloudinary.uploader.destroy(fileToDelete, (result) => {
//       resolve(
//         {
//           url: result.secure_url,
//           asset_id: result.asset_id,
//           public_id: result.public_id,
//         },
//         {
//           resource_type: "auto",
//         }
//       );
//     });
//   });
// };

// module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };


const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const getEnvValue = (name) => process.env[name]?.trim();

const cloudName = getEnvValue("CLOUD_NAME");
const apiKey = getEnvValue("API_KEY");
const apiSecret = getEnvValue("API_SECRET") || getEnvValue("SECRET_KEY");

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

const assertCloudinaryConfig = () => {
  const missing = [];
  if (!cloudName) missing.push("CLOUD_NAME");
  if (!apiKey) missing.push("API_KEY");
  if (!apiSecret) missing.push("API_SECRET");

  if (missing.length) {
    throw new Error(`Missing Cloudinary config: ${missing.join(", ")}`);
  }
};

const cloudinaryUploadImg = async (fileToUploads) => {
  assertCloudinaryConfig();

  const result = await cloudinary.uploader.upload(fileToUploads, {
    resource_type: "auto",
    folder: "ecommerce",
  });

  return {
    url: result.secure_url,
    asset_id: result.asset_id,
    public_id: result.public_id,
  };
};

const cloudinaryUploadBuffer = async (fileBuffer) => {
  assertCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "ecommerce",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
  assertCloudinaryConfig();

  return cloudinary.uploader.destroy(fileToDelete);
};

module.exports = { cloudinaryUploadImg, cloudinaryUploadBuffer, cloudinaryDeleteImg };
