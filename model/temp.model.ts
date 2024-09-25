import mongoose from "mongoose";


interface ITemp extends Document {
    phone?: string;
    email?: string;
    otp: string;
    userId?: mongoose.Schema.Types.ObjectId;
    TwoFA?: Boolean;
    createdAt: Date;
}

const TempSchema = new mongoose.Schema<ITemp>({
    phone: { 
        type: String
    },
    email: {
        type: String
    },
    otp: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    TwoFA: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: { 
        type: Date, 
        expires: 172800, 
        default: Date.now 
    }
});

export const Temp = mongoose.model('Temp', TempSchema);