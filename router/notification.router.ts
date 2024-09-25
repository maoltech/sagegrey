import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { wrap } from "../constants/response";
import { notificationController } from "../controller/notification.controller";

class NotificationRoutes{

    public router = Router();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes (){
        this.router.use(wrap(authMiddleWare.AuthenticateOnboardedUsers))
        this.router.get('/', wrap(notificationController.getUserNotifications))
    }
    
}

export const notificationRoutes = new NotificationRoutes();