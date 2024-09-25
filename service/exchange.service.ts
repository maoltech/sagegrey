import { Response } from "express";
import { IBuyRequest, ISellRequest } from "../constants/interface";
import { Buy, ExchangeStatus, IBuy, ISell, Sell } from "../model/exchange.model";
import { Buyer, Seller } from "../model/offer.model";


class ExchangeService {

    public buyService = async(data: IBuyRequest, userId: string, sellerUsername: string) => {

        const{
            sellerId,
            buyCurrency,
            rate,
            method,
            sellAmount,
            buyAmount,
            sellerOfferId
        } = data;

        await Seller.findByIdAndUpdate(sellerOfferId, { $inc: { order: 1 } })
        
        const newBuy: IBuy = new Buy({
            sellerId,
            buyerId: userId,
            buyCurrency,
            rate,
            method,
            sellAmount,
            buyAmount,
            sellOffer: sellerOfferId,
            sellerUsername
        });

        return await newBuy.save();
    }

    public sellService = async(data: ISellRequest, userId: string, buyerUsername: string) => {

        const{
            buyerId,
            sellCurrency,
            rate,
            method,
            sellAmount,
            buyAmount,
            buyerOfferId
        } = data;

        await Buyer.findByIdAndUpdate(buyerOfferId, { $inc: { order: 1 } })

        const newSell: ISell = new Sell({
            sellerId: userId,
            buyerId,
            sellCurrency,
            rate,
            method,
            sellAmount,
            buyAmount,
            buyOffer: buyerOfferId,
            buyerUsername
        });
        
        return await newSell.save();
    }


    public getSingleBuy = async(id: string) => {
        return await Buy.findById(id);
    }

    public getSingleSell = async(id: string) => {
        return await Sell.findById(id);
    }

    public cancelBuyOrder = async(id: string) => {
        return await Buy.findByIdAndUpdate(id, { status: ExchangeStatus.Cancelled, active: false });
    }
    public cancelSellOrder = async(id: string) => {
        return await Sell.findByIdAndUpdate(id, { status: ExchangeStatus.Cancelled, active: false });
    }

    public sellerPaidOnBuyOrder = async(id: string) => {
        return await Buy.findByIdAndUpdate(id, { sellCurrencySent: true });
    }

    public buyerReceiveOnSellOrder = async(id: string) => {
        return await Sell.findByIdAndUpdate(id, { buyCurrencyReceived: true, status: ExchangeStatus.Complete, active: false });
    }

    public sellerPaidOnSellOrder = async(id: string) => {
        return await Sell.findByIdAndUpdate(id, { sellCurrencySent: true });
    }

    public buyerReceiveOnBuyOrder = async(id: string) => {
        return await Buy.findByIdAndUpdate(id, { buyCurrencyReceived: true, active: false, status: ExchangeStatus.Complete });
    }

    public getSellsList = async (userId: string, skip: number, page: number, countPerPage: number) => {
        try {
            const sells = await Sell.find({ sellerId: userId })
               .skip(skip)
               .limit(countPerPage)
               .exec();
               const totalSells = await Sell.countDocuments({ userId });

               const totalPages = Math.ceil(totalSells / countPerPage);
               return {
                   sells,
                   page,
                   countPerPage,
                   totalPages,
                   totalSells
               }
        }catch(err: any){
            throw new Error(err);
        }
    }

    public getBuysList = async (userId: string, skip: number, page: number, countPerPage: number) => {
        try {
            const buys = await Buy.find({ buyerId: userId })
               .skip(skip)
               .limit(countPerPage)
               .exec();
               const totalBuys = await Buy.countDocuments({ userId });

               const totalPages = Math.ceil(totalBuys / countPerPage);
               return {
                   buys,
                   page,
                   countPerPage,
                   totalPages,
                   totalBuys
               }
        }catch(err: any){
            throw new Error(err);
        }
    }

    public getSellsListAsBuyer = async (userId: string, skip: number, page: number, countPerPage: number) => {
        try {
            const sells = await Sell.find({ buyerId: userId })
               .skip(skip)
               .limit(countPerPage)
               .exec();
               const totalSells = await Sell.countDocuments({ userId });

               const totalPages = Math.ceil(totalSells / countPerPage);
               return {
                   sells,
                   page,
                   countPerPage,
                   totalPages,
                   totalSells
               }
        }catch(err: any){
            throw new Error(err);
        }
    }

    public getBuysListAsSeller = async (userId: string, skip: number, page: number, countPerPage: number) => {
        try {
            const buys = await Buy.find({ sellerId: userId })
               .skip(skip)
               .limit(countPerPage)
               .exec();
               const totalBuys = await Buy.countDocuments({ userId });

               const totalPages = Math.ceil(totalBuys / countPerPage);
               return {
                   buys,
                   page,
                   countPerPage,
                   totalPages,
                   totalBuys
               }
        }catch(err: any){
            throw new Error(err);
        }
    }

    public getOrderHistory = async (userId: string, skip: number, page: number, countPerPage: number) => {
        try {

            const buys = await Buy.find({ $or: [{ sellerId: userId }, { buyerId: userId }] }).exec();
            const totalBuys = await Buy.countDocuments({ $or: [{ sellerId: userId }, { buyerId: userId }] });
            
            const sells = await Sell.find({ $or: [{ sellerId: userId }, { buyerId: userId }] }).exec();
            const totalSells = await Sell.countDocuments({ $or: [{ sellerId: userId }, { buyerId: userId }] });
    
            const exchanges = [...buys, ...sells];
    
            const totalItems = totalBuys + totalSells;
            const totalPages = Math.ceil(totalItems / countPerPage);
    
            const paginatedData = exchanges.slice(skip, skip + countPerPage);
            const data = paginatedData.map((e: any )=> {
                if (e.sellerId == userId) {
                    return { ...e.toObject(), action: "sell" };
                } else {
                    return { ...e.toObject(), action: "buy" };
                }
            })
    
            return {
                data,
                page,
                countPerPage,
                totalPages,
                totalBuys,
                totalSells
            };
        } catch (err: any) {
            throw new Error(err);
        }
    }
}
export const exchangeService = new ExchangeService();