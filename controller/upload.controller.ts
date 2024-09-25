import { Request, Response } from 'express';
import { uploadToCloudinary } from '../service/uploadpics.service';
import { BadRequestResponse, SuccessResponse } from '../constants/response';

class UploadFile {

    public initialize = async(req: Request, res: Response) =>{
          try {

              const files = req.files as Express.Multer.File[];
          
              const categorizedFiles = {
                images: [] as Express.Multer.File[],
                videos: [] as Express.Multer.File[],
                docs: [] as Express.Multer.File[],
                others: [] as Express.Multer.File[],
              };
              let folder = 'others';
              files.forEach((file) => {
                if (file.mimetype.startsWith('image')) {
                  folder = 'images';
                  categorizedFiles.images.push(file);
                } else if (file.mimetype.startsWith('video')) {
                  folder = 'videos';
                  categorizedFiles.videos.push(file);
                } else if (file.mimetype.startsWith('application/pdf') || file.mimetype.startsWith('application/msword')) {
                  folder = 'docs';
                  categorizedFiles.docs.push(file);
                } else {
                  categorizedFiles.others.push(file);
                }
              });
              
              const cloudinaryLinks = await Promise.all(files.map(async (file) => {
                  // const path = `uploads/${file.originalname}`;
                  const cloudinaryLink = await uploadToCloudinary.uploadFile(file.buffer, folder);
                  return cloudinaryLink;
                }));
          
              return SuccessResponse(res,{ links: cloudinaryLinks })

          } catch (error: any) {
            console.error(error);
            return BadRequestResponse(res, { error: error.message });
          }
    }
}

export const uploadFile = new UploadFile();