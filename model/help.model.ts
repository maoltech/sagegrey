import mongoose from "mongoose";

export enum  helpStatus{
    pending = 'pending',
    resolved = 'resolved',
    cancelled = 'cancelled'  
}

export interface IHelp extends mongoose.Document{
    userId: string;
    type: string;
    message: string;
    email: string;
    status: helpStatus;
}

const helpSchema = new mongoose.Schema<IHelp>({
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    message: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: helpStatus.pending,
        required: true  
    }
    
});

export const Help = mongoose.model('Help', helpSchema);