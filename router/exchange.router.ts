import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { Response, NextFunction } from "express";
import { exchangeController } from "../controller/exchange.controller";
import { wrap } from "../constants/response";


class ExchangeRoutes{

    public router = Router();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes (){
        
        this.router.use(wrap(authMiddleWare.AuthenticateOnboardedUsers))
        this.router.post('/buy', wrap(exchangeController.buy))
        this.router.post('/buy/cancel/:buyId', wrap(exchangeController.buyCancel))
        this.router.post('/buy/received/:buyId/:offerId', wrap(exchangeController.buyerReveceiveOnBuy))
        this.router.post('/buy/secondparty/sent/:buyId', wrap(exchangeController.sellerSentOnBuy))
        this.router.post('/sell', wrap(exchangeController.sell))
        this.router.post('/sell/cancel/:sellId', wrap(exchangeController.sellCancel))
        this.router.post('/sell/secondparty/received/:sellId/:offerId', wrap(exchangeController.buyerReceiveOnSell))
        this.router.post('/sell/sent/:sellId', wrap(exchangeController.sellerSentOnSell))
        this.router.get('/buy/:id', wrap(exchangeController.getBuyById))
        this.router.get('/sell/:id', wrap(exchangeController.getSellById))
        this.router.get('/sells', wrap(exchangeController.getSellsList))
        this.router.get('/buys', wrap(exchangeController.getBuysList))
        this.router.get('/buys/seller', wrap(exchangeController.getBuysAsSeller))
        this.router.get('/sells/buyer', wrap(exchangeController.getSellsAsBuyer))
        this.router.get('/history', wrap(exchangeController.history))
    }
    
}

export const exchangeRoutes = new ExchangeRoutes();