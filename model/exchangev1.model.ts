import mongoose from "mongoose";
import { IOffer } from "./offerV1.model";

export enum ExchangeStatus {
    InProgress = "InProgress",
    Complete = "Complete",
    Failed = "Failed",
    Cancelled = "Cancelled",
    Dispute = "Dispute"
}

export enum OrderType {
    Buy = "Buy",
    Sell = "Sell"
}

export interface IOrder extends mongoose.Document {
    userId: string;
    offererId: string;
    currency: string;
    rate: number;
    buyCurrencyReceived: boolean;
    sellCurrencySent: boolean;
    active: boolean;
    status: ExchangeStatus;
    method: string;
    sellAmount: number;
    buyAmount: number;
    offer: string;
    type: OrderType;
    offererUsername: string;

};


const buySchema = new mongoose.Schema<IOrder>({

    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    offererUsername: {
        type: String,
        required: true
    },
    offererId: { 
        type: String,
        ref: 'User',
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    currency: {
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
    offer: {
        type: String,
        ref: "Offer",
        required: true

    },
    sellCurrencySent: {
        type: Boolean,
        required: true,
        default: false
    },
    type:{
        type: String,
        required: true,
        enum: OrderType
        
    }

})


export const Exchange = mongoose.model<IOrder>("Order", buySchema);