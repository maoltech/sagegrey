import mongoose from "mongoose";

export interface IBuyer extends mongoose.Document {

    userId: string;
    buyCurrency: string;
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

};

export interface ISeller extends mongoose.Document {

    userId: string;
    sellCurrency: string;
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
    
};

const buyerSchema = new mongoose.Schema<IBuyer>({
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
    }

})

const sellerSchema = new mongoose.Schema<ISeller>({
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
    sellCurrency: {
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
    }

})

buyerSchema.pre<IBuyer>('save', async function (next) {
    this.completedPercentage = (this.completed / this.order) * 100;
    next();
});
sellerSchema.pre<ISeller>('save', async function (next) {
    this.completedPercentage = (this.completed / this.order) * 100;
    next();
});

export const Buyer = mongoose.model<IBuyer>("Buyer", buyerSchema);
export const Seller = mongoose.model<ISeller>("Seller", sellerSchema);