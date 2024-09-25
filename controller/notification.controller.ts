import { Response } from "express";
import { IRequest } from "../constants/interface";
import { notificationService } from "../service/notification.service";
import { SuccessResponse } from "../constants/response";


class NotificationController {

    public async getUserNotifications(req: IRequest, res: Response): Promise<any> {
        const notifications = await notificationService.findNotificationsByUserId(req.userId);
        SuccessResponse(res, notifications)
    }
}

export const notificationController = new NotificationController();