import { MultipartFile } from '@fastify/multipart';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export function createImageHandlerService() {
    cloudinary.config({
        cloud_name: 'do5nexc9k',
        api_key: '569449376115175',
        api_secret: 'SUh0Lwa9D4NhWO-bC-9XUBeCeww',
    });
    return {
        async uploadImage(file: MultipartFile): Promise<string> {

            if (file.file.bytesRead === 0) {
                console.log("empty");
                throw new Error('The file is empty');
            }            
            
            const allowedMimeTypes = ['image/jpeg', 'image/png'];
    
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new Error('Invalid file type. Only JPEG and PNG are allowed.');
            }
    
            const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) {
                            reject(new Error(`Upload error: ${error.message}`));
                        } else if (result) {
                            resolve(result);
                        } else {
                            reject(new Error('No result returned from Cloudinary'));
                        }
                    }
                );
                file.file.pipe(uploadStream);
            });
            
            return (uploadResult).secure_url;
        },
    }
}