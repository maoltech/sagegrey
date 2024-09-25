import mongoose from "mongoose";

export enum OfferType {
    Buy = "Buy",
    Sell = "Sell"
}

export interface IOffer extends mongoose.Document {

    userId: string;
    currency: string;
    rate: number;
    minQuantity: number;
    maxQuantity: number;
    completed: number;
    totalTransactions: number;
    username: string;
    methods: string[];
    active: boolean;
    isDeleted: boolean;
    order: number;
    completedPercentage: number;
    type: OfferType;

};


const buyerSchema = new mongoose.Schema<IOffer>({
    userId: { 
        type: String,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 20,
        sparse: true,
        default: null
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
    minQuantity: {
        type: Number,
        required: true
    },
    maxQuantity: {
        type: Number,
        required: true
    },
    completed: {
        type: Number,
        required: true,
        default: 0
    },
    totalTransactions: {
        type: Number,
        required: true,
        default: 0
    },
    methods: {
        type: [{ type: String }],
        required: true,
        default: []
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    completedPercentage: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: String,
        enum: OfferType,
        required: true
    }

})

buyerSchema.pre<IOffer>('save', async function (next) {
    this.completedPercentage = (this.completed / this.order) * 100;
    next();
});


export const Offer = mongoose.model<IOffer>("Offer", buyerSchema);