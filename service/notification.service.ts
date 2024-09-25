import { Notification } from "../model/notification.model";


class NotificationService {

    public async createNotification (title: string, message: string, recipients:  string[]): Promise<void> {
        const notification = new Notification({
            title,
            message,
            recipients,
          });
          
        await notification.save();
    }


    public async findNotificationsByUserId(userId: string) {
        try {
          const notifications = await Notification.find({ recipients: userId });
          return notifications;
        } catch (error) {
          console.error('Error finding notifications:', error);
          throw error;
        }
    }
}

export const notificationService = new NotificationService();