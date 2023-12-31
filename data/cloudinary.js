import cloudinary from "cloudinary";

export const connectCloudinary = () => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUNDINARY_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET,
  });
};
