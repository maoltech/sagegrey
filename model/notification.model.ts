import { Schema, model, Document } from 'mongoose';

// Define the interface for the Notification document
interface INotification extends Document {
  title: string;
  message: string;
  recipients: String[];
  isReadBy: String[]; 
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the Notification model
const notificationSchema = new Schema<INotification>({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  recipients: [
    {
      type: String,
      ref: 'User',
      required: true,
    },
  ],
  isReadBy: [
    {
      type: String,
      ref: 'User',
    },
  ],
}, {
  timestamps: true,
});

// Create the Notification model
const Notification = model<INotification>('Notification', notificationSchema);

export { Notification, INotification };
