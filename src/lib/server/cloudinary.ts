import { v2 as cloudinary } from 'cloudinary';
import { PRIVATE_CLOUDINARY_API_KEY, PRIVATE_CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

cloudinary.config({
  cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: PRIVATE_CLOUDINARY_API_KEY,
  api_secret: PRIVATE_CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string = 'uploads') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
