const cloudinary = require("cloudinary");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryUploadFiles = asyncHandler(async (req, res, next) => {
  const files = req.files.images;

  const uploadResult = await Promise.all(
    files.map(async (file) => {
      const result = await cloudinary.v2.uploader.upload(file.path, {
        resource_type: "auto",
      });

      return result;
    })
  );

  res.status(200).json({ data: uploadResult });
});

module.exports = { cloudinaryUploadFiles };
