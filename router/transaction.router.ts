import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { Response, NextFunction } from "express";
import { transactionController } from "../controller/transaction.controller";
import { wrap } from "../constants/response";


class TransactionRoutes{

    public router = Router();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes (){
        
        this.router.post('/webhook', transactionController.fund)
        this.router.use(wrap(authMiddleWare.notOnboardedUsers))
        this.router.post('/withdraw', wrap(transactionController.withdraw))
        this.router.get('/history', wrap(transactionController.transactionHistory))
        this.router.post('/verify/account', wrap(transactionController.verifyAccountDetails))
        this.router.get('/bank/list', wrap(transactionController.banklist))
        
    }
    
}

export const transactionRoutes = new TransactionRoutes();