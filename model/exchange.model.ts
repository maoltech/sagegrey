import mongoose from "mongoose";

export enum ExchangeStatus {
    InProgress = "InProgress",
    Complete = "Complete",
    Failed = "Failed",
    Cancelled = "Cancelled",
    Dispute = "Dispute"
}

export interface IBuy extends mongoose.Document {
    buyerId: string;
    sellerId: string;
    buyCurrency: string;
    rate: number;
    buyCurrencyReceived: boolean;
    sellCurrencySent: boolean;
    active: boolean;
    status: ExchangeStatus;
    method: string;
    sellAmount: number;
    buyAmount: number;
    sellOffer: string;
    type: string;
    sellerUsername: string;

};

export interface ISell extends mongoose.Document {

    buyerId: string;
    sellerId: string;
    sellCurrency: string;
    rate: number;
    buyCurrencyReceived: boolean;
    sellCurrencySent: boolean;
    active: boolean;
    status: ExchangeStatus;
    method: string;
    sellAmount: number;
    buyAmount: number;
    buyOffer: string;
    type: string;
    buyerUsername: string;
    
};

const buySchema = new mongoose.Schema<IBuy>({

    buyerId: {
        type: String,
        ref: 'User',
        required: true
    },
    sellerUsername: {
        type: String,
        required: true
    },
    sellerId: { 
        type: String,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    buyCurrency: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 4
    },
    rate: {
        type: Number,
        required: true
    },
    sellAmount: {
        type: Number,
        required: true
    },
    buyAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: ExchangeStatus.InProgress
    },
    method: {
        type: String,
        required: true
    },
    buyCurrencyReceived: {
        type: Boolean,
        required: true,
        default: false
    },
    sellOffer: {
        type: String,
        ref: "Seller",
        required: true

    },
    sellCurrencySent: {
        type: Boolean,
        required: true,
        default: false
    },
    type:{
        type: String,
        default: "buy"
    }

})

const sellSchema = new mongoose.Schema<ISell>({

    buyerId: {
        type: String,
        ref: 'User',
        required: true
    },
    buyerUsername: {
        type: String,
        required: true
    },
    sellerId: { 
        type: String,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    sellCurrency: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 4
    },
    sellCurrencySent: {
        type: Boolean,
        required: true,
        default: false
    },
    rate: {
        type: Number,
        required: true
    },
    sellAmount: {
        type: Number,
        required: true
    },
    buyAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: ExchangeStatus.InProgress
    },
    method: {
        type: String,
        required: true
    },
    buyCurrencyReceived: {
        type: Boolean,
        required: true,
        default: false
    },
    buyOffer: {
        type: String,
        ref: "Buyer",
        required: true
    },
    type:{
        type: String,
        default: "sell"
    }

})

export const Buy = mongoose.model<IBuy>("Buy", buySchema);
export const Sell = mongoose.model<ISell>("Sell", sellSchema);