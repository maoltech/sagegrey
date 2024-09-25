import { Request } from "express";
import { OrderType } from "../model/exchangev1.model";

export interface IBuyRequest {
    sellerId: string,
    buyCurrency: string,
    rate: Number,
    sellAmount: Number,
    buyAmount: Number,
    method: string,
    sellerOfferId: string,
           
}

export interface IOrderRequest {
    offererId: string,
    buyCurrency: string,
    rate: Number,
    sellAmount: Number,
    buyAmount: Number,
    method: string,
    OfferId: string,
    type: OrderType
           
}

export interface ISellRequest {
    buyerId: string,
    sellCurrency: string,
    rate: Number,
    sellAmount: Number,
    buyAmount: Number,
    method: string,
    buyerOfferId: string,
           
}

export interface IOnboardData{
    firstName?: string;
    lastName?: string;
    dob?: Date;
    address?: string;
    bvn?: string;
    
}

export interface IUserData{
    firstName?: string;
    lastName?: string;
    dob?: Date;
    address?: string;
    bvn?: string;
    email?: string,
    phone?: string,
    username?: string
    
}

export interface IWithdrawRequest {
    account_bank: string,
    account_number: string,
    amount: Number,
    narration: String,
    currency: String       
}

export interface IVerifyAccountRequest {
    account_number: string,
    account_bank: string,
}

export interface signupDataType{
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
    password?: string,
    username?: string,
    oldPassword?: string,
    newPassword?: string,
    token?: string
}

export interface IRequest extends Request {
    userId: string,
    userMail: string,
    user: any
}