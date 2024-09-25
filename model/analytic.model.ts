import { Document, Schema, model } from "mongoose";

export interface IAnalytics extends Document{
    userId: string,
    tradingVolume: number,
    tradingCount: number,
    tradingCurrencyVolume: { [currency: string]: number },
    tradingCurrencyCount: { [currency: string]: number },
    buyCurrencyVolume: number[],
    buyCurrencyCount: number[],
    sellCurrencyVolume: number[],
    sellCurrencyCount: number[],
    tradingPartners: string[]
}

const AnalyticsSchema = new Schema<IAnalytics>({
    userId:{
        type: String,
        required: true,
        ref: 'User'
    },
    tradingVolume: {
        type: Number,
        default: 0
    },
    tradingCount: {
        type: Number,
        default: 0
    },
    tradingCurrencyVolume: {
        type: Object,
        default: {}
    },
    tradingCurrencyCount: {
        type: Object,
        default: {}
    },
    buyCurrencyVolume: {
        type: Object(Number),
        default: null
    },
    buyCurrencyCount: {
        type: Object(Number),
        default: null
    },
    sellCurrencyVolume: {
        type: Object(Number),
        default: null
    },
    sellCurrencyCount: {
        type: Object(Number),
        default: null
    },
    tradingPartners: {
        type: Object(String),
        default: null
    }
})

export const Analytics = model<IAnalytics>('analytics', AnalyticsSchema);