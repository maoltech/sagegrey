import mongoose from "mongoose";

export enum TransactionType {
    Credit = "Credit",
    Debit = "Debit"
}

export interface ITransaction extends mongoose.Document{
    type: TransactionType;
    flw_ref: string;
    device_fingerprint: string;
    amount: Number;
    currency: string;
    charged_amount: Number;
    app_fee: Number;
    merchant_fee: Number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: string;
    created_at: Date;
    account_id: Number;
    userId: String;
    walletId: String;
    tx_ref: String;
    customer_fullname: String;
    customer_phone_number: String;
    customer_email: String;
    customer_created_at: Date;
    bank_code: String;
    full_name: String;
    bank_name: String;
    is_approved: Number;
    account_number: String;
    reference: String;
    fee: Number;
    newBalance: Number;
}

const TransactionSchema =  new mongoose.Schema<ITransaction>({
    userId: { 
        type: String,
        ref: 'User',
        required: true
    },
    walletId: { 
        type: String,
        ref: 'Wallet',
        required: true
    },
    tx_ref: {
        type: String,
    },
    flw_ref: {
        type: String
    },
    device_fingerprint: {
        type: String
    },
    amount: {
        type: Number
    },
    currency: {
        type: String
    },
    charged_amount: {
        type: Number
    },
    app_fee: {
        type: Number
    },
    merchant_fee: {
        type: Number
    },
    processor_response: {
        type: String
    },
    auth_model: {
        type: String
    },
    ip: {
        type: String
    },
    narration: {
        type: String
    },
    status: {
        type: String
    },
    payment_type: {
        type: String
    },
    created_at: {
        type: Date
    },
    account_id: {
        type: Number
    },
    customer_fullname: {
        type: String
    },
    customer_phone_number: {
        type: String
    },
    customer_email: {
        type: String
    },
    customer_created_at: {
        type: Date
    },
    account_number:{
        type: String
    },
    bank_code: {
        type: String
    },
    full_name: { 
        type: String
    },
    bank_name: {
        type: String
    },
    is_approved: {
        type: Number
    },
    reference: {
        type: String
    },
    fee: {
        type: Number
    },
    newBalance: {
        type: Number
    },
    type: {
        type: String,
        enum: TransactionType,
        required: true
    }

});

export const Transaction = mongoose.model('Transaction', TransactionSchema);