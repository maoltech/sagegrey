import cloudinary from 'cloudinary';
class UploadToCloudinary {

    public uploadFile = async (files: Buffer, folder: string)  => {

        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUDNAME as string,
            api_key: process.env.CLOUDINARY_API_KEY as string,
            api_secret: process.env.CLOUDINARY_API_SECRET as string
        });
        
        if (!files || Object.keys(files).length === 0) {
            throw ({ error: 'No files were uploaded.' });
        }

        const result = await new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream({ folder }, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response.secure_url);
                }
            });

            uploadStream.end(files);
        });
        
        return result;
            
    
    }
}

export const uploadToCloudinary = new UploadToCloudinary()