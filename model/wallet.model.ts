import mongoose from "mongoose";

export interface IWallet extends mongoose.Document{
    userId: string;
    balance: number;
    transactions?: string[];
    account_name: string;
    email: string;
    order_ref: string;
    account_number: string;
    bank_name: string;
}

const walletSchema = new mongoose.Schema<IWallet>({

    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
        },
    ],
    account_name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    order_ref: {
        type: String,
        required: true
    },
    account_number: {
        type: String,
        required: true,
    },
    bank_name: {
        type: String,
        required: true
    }
    
});

export const Wallet = mongoose.model('Wallet', walletSchema);