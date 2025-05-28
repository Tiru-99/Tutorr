import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';

const config = cloudinary.config({
    cloud_name : process.env.NEXT_PUBLIC_CLOUD_NAME, 
    api_key : process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY , 
    api_secret : process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
});

export const uploadFileToCloudinary = async (file: File, folderName: string , publicId : string) => {
    //read file bytes 
    const bytes = await file.arrayBuffer();
    
    //convert to node js buffer         
    const buffer = Buffer.from(bytes);              
  
    //  Upload to Cloudinary using upload_stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName ,
            overwrite : true , 
            public_id : publicId
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
  
      // Pipe the buffer into the Cloudinary stream
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  };