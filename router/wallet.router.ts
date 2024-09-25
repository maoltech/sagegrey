import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { Response, NextFunction } from "express";
import { walletController } from "../controller/wallet.controller";
import { wrap } from "../constants/response";


class WalletRoutes{

    public router = Router();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes (){
        
        
        this.router.use(wrap(authMiddleWare.AuthenticateOnboardedUsers))
        this.router.get('/', wrap(walletController.walletDetails))
        this.router.get('/balance', wrap(walletController.balance))
        
    }
    
}

export const walletRoutes = new WalletRoutes();