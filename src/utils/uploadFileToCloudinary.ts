import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import path from 'path'; 

const config = cloudinary.config({
    cloud_name : process.env.NEXT_PUBLIC_CLOUD_NAME, 
    api_key : process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY , 
    api_secret : process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET, 
});

export const uploadFileToCloudinary = async (file: File, folderName: string, publicId: string) => {
  const tempPath = path.join('/tmp', file.name);
  
  // Write the file to /tmp
  await fs.promises.writeFile(tempPath, Buffer.from(await file.arrayBuffer()));

  try {
      const result = await cloudinary.uploader.upload(tempPath, {
          folder: folderName,
          overwrite: true,
          public_id: publicId,
          timeout : 120000 //60 seconds timeout
      } );

      // Optionally delete the temp file after upload
      await fs.promises.unlink(tempPath);

      return result;
  } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw error;
  }
};