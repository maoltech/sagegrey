import { Request, Response } from "express";
import { Wallet } from "../model/wallet.model";
import { BadRequestResponse, ServerResponse, SuccessResponse } from "../constants/response";
import { marketPlaceService } from "../service/market.service";
import { exchangeValidation } from "../validation/exchange.validator";
import { exchangeService } from "../service/exchange.service";
import { Types } from "mongoose";
import { Buyer, Seller } from "../model/offer.model";
import { IRequest } from "../constants/interface";
import { analyticService } from "../service/analytic.service";
import { notificationService } from "../service/notification.service";
import { walletService } from "../service/wallet.service";


class ExchangeController {

    public buy = async(req: IRequest, res: Response) => {
        try {
            
            const {userId, body} = req;

            const {error} = exchangeValidation.buyValidator(body)
            if(error) {
                const message = error
                BadRequestResponse(res, message)
                return
            }

            const sellerOffer = await marketPlaceService.getSellerById(body.sellerOfferId)

            if(!sellerOffer){
                const message = "offer not found";
                BadRequestResponse(res, message);
                return;
            }

            if(sellerOffer.rate !== body.rate){
                const message = "the rate has changed";
                BadRequestResponse(res, message);
                return
            }
            
            const buyOrder = await exchangeService.buyService(body, userId, sellerOffer.username)
            const data = { buyOrder, sellerOffer}
            await notificationService.createNotification(
                "Buy Order Notification", 
                `Your buy order has succefully been placed with orderId: ${buyOrder.id}`, 
                [`${req.userId}`]
            )
            await notificationService.createNotification(
                "Buy order Notification", 
                `A buy order has been placed on your offer with orderId: ${buyOrder.id}`, 
                [`${body.sellerId}`])
            return SuccessResponse(res, data)

        } catch (error:any) {
            console.log(error)
            return ServerResponse(res, {message: error.message});
        }

        
    };

    public sell = async(req: IRequest, res: Response) => {
        try {
            
            const {userId, body} = req;

            const {error} = exchangeValidation.sellValidator(body)
            if(error) {
                const message = error
                BadRequestResponse(res, message)
                return
            }

            const buyerOffer = await marketPlaceService.getBuyerById(body.buyerOfferId)

            if(!buyerOffer){
                const message = "offer not found";
                BadRequestResponse(res, message);
                return;
            }

            if(buyerOffer.rate !== body.rate){
                const message = "the rate has changed";
                BadRequestResponse(res, message);
                return
            }
            
            const sellOrder = await exchangeService.sellService(body, userId, buyerOffer.username)
            const data = {sellOrder, buyerOffer}
            await notificationService.createNotification(
                "Sell Order Notification", 
                `Your sell order has succefully been placed with orderId: ${sellOrder.id}`, 
                [`${req.userId}`]
            )
            await notificationService.createNotification(
                "Sell order Notification", 
                `A sell order has been placed on your offer with orderId: ${sellOrder.id}`, 
                [`${body.buyerId}`])
            return SuccessResponse(res, data)

        } catch (error:any) {
            console.log(error)

            return ServerResponse(res, {message: error.message});
        }
        
    };


    public buyCancel = async(req: IRequest, res: Response) => {
        try {
            const {userId, params} = req;
            
            const buy = await exchangeService.getSingleBuy(params.buyId)

            if(!buy) {
                const message = "buy order not found";
                BadRequestResponse(res, message);
                return;
            }

            if (userId != buy.buyerId) {
                const message = "Your can only Cancel your buy order"
                return BadRequestResponse(res, message);
            }

            if (buy.sellCurrencySent == true) {
                const message = "You can't cancel an order after sell has send funds"
                BadRequestResponse(res, message);
                return
            }

            const data = await exchangeService.cancelBuyOrder(params.buyId)
            await notificationService.createNotification(
                "Buy Order Cancelled Notification", 
                `Your buy order has succefully been cancelled`, 
                [`${req.userId}`]
            )
            await notificationService.createNotification(
                "Buy Order Cancelled Notification", 
                `A buy order has been cacelled on your offer`, 
                [`${buy.sellerId}`])
            return SuccessResponse(res, data)

        }catch (err: any) {
            console.log(err)
            return ServerResponse(res, {message: err.message});
        }
    }

    public sellCancel = async(req: IRequest, res: Response) => {
        try {
            const {userId, params} = req;

            const sell = await exchangeService.getSingleSell(params.sellId)

            if(!sell) {
                const message = "sell order not found";
                BadRequestResponse(res, message);
                return;
            }

            if (userId != sell.sellerId) {

                const message = "Your can only Cancel your sell order"
                BadRequestResponse(res, message);
                return
            }

            if (sell.sellCurrencySent == true) {
                const message = "You can't cancel an order after sell has send funds"
                BadRequestResponse(res, message);
                return
            }

            const data = await exchangeService.cancelSellOrder(params.sellId)
            await notificationService.createNotification(
                "Sell Order Cancelled Notification", 
                `Your sell order has succefully been cancelled`, 
                [`${req.userId}`]
            )
            await notificationService.createNotification(
                "Sell Order Cancelled Notification", 
                `A sell order has been cacelled on your offer`, 
                [`${sell.buyerId}`])
            return SuccessResponse(res, data)

        }catch (err: any) {
            console.log(err)
            return ServerResponse(res, {message: err.message});
        }
    }

    public sellerSentOnBuy = async(req: IRequest, res: Response) => {
        try {
            const {userId, params} = req;
            const buy = await exchangeService.getSingleBuy(params.buyId)

            if(!buy) {
                const message = "buy order not found";
                BadRequestResponse(res, message);
                return;
            }

            
            // if(userId != buy.sellerId) {
            //     const message = "You cannot send if you not the seller";
            //     return BadRequestResponse(res, message);
            // }

            const order = await exchangeService.sellerPaidOnBuyOrder(params.buyId);
            SuccessResponse(res, order);
        } catch (err: any) {
            console.log(err);
            ServerResponse(res, {message: err.message});
            return;
        }
    }

    public sellerSentOnSell = async(req: IRequest, res: Response) => {
        try {
            const {userId, params} = req;
            const sell = await exchangeService.getSingleSell(params.sellId)

            if(!sell) {
                const message = "sell order not found";
                BadRequestResponse(res, message);
                return;
            }

            if(userId != sell.sellerId) {
                const message = "You cannot send if you not the seller";
                BadRequestResponse(res, message);
                return;
            }

            const order = await exchangeService.sellerPaidOnSellOrder(params.sellId)
            SuccessResponse(res, order);
        } catch (err: any) {
            console.log(err);
            ServerResponse(res, {message: err.message});
            return;
        }
    }

    public buyerReveceiveOnBuy = async (req: IRequest, res: Response) => {

        try {
            const {userId, params} = req; 
            const buy = await exchangeService.getSingleBuy(params.buyId)
            if(!buy) {
                const message = "buy order not found";
                BadRequestResponse(res, message);
                return;
            }

            if(userId != buy.buyerId) {
                const message = "You cannot receive if you not the buyer";
                 return BadRequestResponse(res, message);
            }

            const order = await exchangeService.buyerReceiveOnBuyOrder(params.buyId)
            if(!order){
                const message = "buy order not found";
                BadRequestResponse(res, message);
                return;
            }
            await Seller.findByIdAndUpdate(params.offerId, {$inc: {completed : 1}})
            await walletService.creditAccount(order.sellerId, order.sellAmount)
            await walletService.debitAccount(order.buyerId, order.sellAmount)
            await analyticService.updateTradeAnalytics(order.buyerId, order.sellAmount, 'buy')
            await analyticService.updateTradeAnalytics(order.sellerId, order.sellAmount, 'sell')
            analyticService.updateRelationshipAnalytics(order.buyerId, order.sellerId, order.buyCurrency, order.buyAmount)
            analyticService.updateRelationshipAnalytics(order.sellerId, order.buyerId, order.buyCurrency, order.buyAmount)
            return SuccessResponse(res, order)


        } catch (err: any) {
            console.log(err);
            return ServerResponse(res, {message: err.message});
        }
    }

    public buyerReceiveOnSell = async (req: IRequest, res: Response) => {

        try{
            const {userId, params} = req;
            const sell = await exchangeService.getSingleSell(params.sellId)

            if(!sell) {
                const message = "sell order not found";
                BadRequestResponse(res, message);
                return;
            }

            if(userId != sell.buyerId) {
                const message = "You cannot receiver if you not the buyer";
                return BadRequestResponse(res, message);
            }
           
            const order = await exchangeService.buyerReceiveOnSellOrder(params.sellId)
            if(!order){
                const message = "buy order not found";
                BadRequestResponse(res, message);
                return;
            }
            await Buyer.findByIdAndUpdate(params.offerId, {$inc: {completed: 1}})
            await walletService.creditAccount(order.sellerId, order.buyAmount)
            await walletService.debitAccount(order.buyerId, order.buyAmount)
            await analyticService.updateTradeAnalytics(order.buyerId, order.buyAmount, 'buy')
            await analyticService.updateTradeAnalytics(order.sellerId, order.buyAmount, 'sell')
            analyticService.updateRelationshipAnalytics(order.buyerId, order.sellerId, order.sellCurrency, order.sellAmount)
            analyticService.updateRelationshipAnalytics(order.sellerId, order.buyerId, order.sellCurrency, order.sellAmount)
            
            return SuccessResponse(res, order)
        }catch(err: any){
            console.log(err)
            return ServerResponse(res, {message: err.message})
        }

    };

    public getBuyById = async(req: IRequest, res: Response) => {
        try{
            const buyOrder = await exchangeService.getSingleBuy(req.params.id)
        
            if(!buyOrder){
                const message = "order not found";
                BadRequestResponse(res, message);
                return;
            }
            const  sellerOffer = await marketPlaceService.getSellerById(buyOrder.sellOffer)
            if(!sellerOffer){
                const message = "offer not found";
                BadRequestResponse(res, message);
                return;
            }
            const  data = {buyOrder, sellerOffer}
            return SuccessResponse(res, data)
        }catch(err: any){
            return ServerResponse(res, {message: err.message})
        }
        
    }

    public getSellById = async(req: IRequest, res: Response) => {
        try{
            const sellOrder = await exchangeService.getSingleSell(req.params.id)
            if(!sellOrder){
                const message = "order not found";
                BadRequestResponse(res, message);
                return;
            }
            const  buyerOffer = await marketPlaceService.getBuyerById(sellOrder.buyOffer)
            if(!buyerOffer){
                const message = "offer not found";
                BadRequestResponse(res, message);
                return;
            }
            const  data = {sellOrder, buyerOffer}
            return SuccessResponse(res, data)
        }catch(err: any){
            return ServerResponse(res, {message: err.message})
        }
        
    }

    public getSellsList =  async (req: IRequest, res: Response) => {
        try{
            const {page, count} = req.query;
            const pageNum = parseInt(page as string) || 1;
            const countPerPage = parseInt(count as string) || 10;
    
            const skip = (pageNum - 1) * countPerPage;
            const data = await exchangeService.getSellsList(req.userId, skip, pageNum, countPerPage)
            if(!data){
                const message = "Sell order history not found";
                BadRequestResponse(res, message);
                return;
            }
            return SuccessResponse(res, data)
        }catch(err: any){
            return ServerResponse(res, {message: err.message})
        }
    }

    public getBuysList =  async (req: IRequest, res: Response) => {
        try{

            const {page, count} = req.query;
            const pageNum = parseInt(page as string) || 1;
            const countPerPage = parseInt(count as string) || 10;
    
            const skip = (pageNum - 1) * countPerPage;
            const data = await exchangeService.getBuysList(req.userId, skip, pageNum, countPerPage)
            if(!data){
                const message = "Buy order history not found";
                BadRequestResponse(res, message);
                return;
            }
            return SuccessResponse(res, data)
        }catch(err: any){
            return ServerResponse(res, {message: err.message})
        }
    } 
    
    public getSellsAsBuyer =  async (req: IRequest, res: Response) => {
        try{
            const {page, count} = req.query;
            const pageNum = parseInt(page as string) || 1;
            const countPerPage = parseInt(count as string) || 10;
    
            const skip = (pageNum - 1) * countPerPage;
            const data = await exchangeService.getSellsListAsBuyer(req.userId, skip, pageNum, countPerPage)
            if(!data){
                const message = "Sell order history not found";
                BadRequestResponse(res, message);
                return;
            }
            return SuccessResponse(res, data)
        }catch(err: any){
            return ServerResponse(res, {message: err.message})
        }
    }

    public getBuysAsSeller =  async (req: IRequest, res: Response) => {
        try{

            const {page, count} = req.query;
            const pageNum = parseInt(page as string) || 1;
            const countPerPage = parseInt(count as string) || 10;
    
            const skip = (pageNum - 1) * countPerPage;
            const data = await exchangeService.getBuysListAsSeller(req.userId, skip, pageNum, countPerPage)
            if(!data){
                const message = "Buy order history not found";
                BadRequestResponse(res, message);
                return;
            }
            return SuccessResponse(res, data)
        }catch(err: any){
            return ServerResponse(res, {message: err.message})
        }
    }

    public history =  async (req: IRequest, res: Response) => {
        try{

            const {page, count} = req.query;
            const pageNum = parseInt(page as string) || 1;
            const countPerPage = parseInt(count as string) || 10;
    
            const skip = (pageNum - 1) * countPerPage;
            const data = await exchangeService.getOrderHistory(req.userId, skip, pageNum, countPerPage)
            if(!data){
                const message = "order history not found";
                BadRequestResponse(res, message);
                return;
            }
            return SuccessResponse(res, data)
        }catch(err: any){
            return ServerResponse(res, {message: err.message})
        }
    } 

}

export const exchangeController = new ExchangeController();