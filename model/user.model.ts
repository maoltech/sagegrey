import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserBase extends mongoose.Document {
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    isActive: boolean;
    isAdmin: boolean;
    isPhoneVerified: boolean;
    isBvnVerified: boolean;
    twoFactorEnabled: boolean;
    dob: Date;
    bvn: string;
    profilePics: string;
    isOnboarded: boolean;
    isEmailVerified: boolean;
    address: string;
    twoFactorSecret: string;
    totalTrades: Number;
    totalsuccessfullTrades: Number;
    totalFailedTrades: Number,
    totalWithdrawals: Number,
    totalDeposits: Number,
    customerId?: Number
}
export interface UserDocument extends UserBase, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>({

    username: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 20,
        unique: true,
        default: null
    },
    bvn: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 20,
        sparse: true,
        default: null
    },
    profilePics: {
        type: String,
        sparse: true,
        default: 'https://res.cloudinary.com/emman/image/upload/v1712917723/images/w0bzgtxyccih6gpenvla.jpg'

    },
    firstName: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    lastName: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 20,
    },
    phone: {
        type: String,
        trim: true,
        minlength: 10,
        maxlength: 15,
        sparse: true,
        default: null
    },
    address: {
        type: String,
        trim: true,
        sparse: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email address',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    dob: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true,
        minlength: 6,
    },
    isOnboarded: {
        type: Boolean,
        default: false,
        required: true,
        minlength: 6,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true,
        minlength: 6,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
        required: true,
        minlength: 6,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
        required: true,
        minlength: 6,
    },
    isBvnVerified: {
        type: Boolean,
        default: false,
        required: true,
        minlength: 6,
    },
    twoFactorSecret:{
        type: String,
    },
    customerId: {
        type: Number,
    },
    totalTrades: {
        type: Number,
        default: 0
    },
    totalsuccessfullTrades: {
        type: Number,
        default: 0
    },
    totalFailedTrades: {
        type: Number,
        default: 0
    },
    totalDeposits: {
        type: Number,
        default: 0
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false,
        required: true,
        minlength: 6,
    }

});

userSchema.pre('save', async function (next: any) {
    const user = this;
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    if (user.isModified('email')) {
        user.email = user.email.toLowerCase();
    }
    
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);

