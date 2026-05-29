import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const removeLocalFile = (file) => {
  if (file && fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
};

const uploadOnCloudinary = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    const result = await cloudinary.uploader.upload(file);
    removeLocalFile(file);
    return result.secure_url;
  } catch (error) {
    removeLocalFile(file);
    throw error;
  }
};

export default uploadOnCloudinary;
