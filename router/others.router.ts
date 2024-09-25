import { Router, Request, Response } from 'express';
import { authMiddleWare } from "../middleware/auth.middleware";
import { uploadFile } from '../controller/upload.controller';
import multer from 'multer';
interface IAuth {
    router: Router;
}

class OtherRoutes {
    public router= Router();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes () {
        const storage = multer.memoryStorage();
        const upload = multer({ storage: storage });
        this.router.post('/uploads', upload.array('files'), uploadFile.initialize)


    }
}

export const otherRoutes = new OtherRoutes();