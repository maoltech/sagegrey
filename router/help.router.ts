import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { Response, NextFunction } from "express";
import { walletController } from "../controller/wallet.controller";
import { wrap } from "../constants/response";
import { helpController } from "../controller/help.controller";


class HelpRoutes{

    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes (){
        
        
        this.router.use(wrap(authMiddleWare.notOnboardedUsers))
        this.router.post('', wrap(helpController.create))
        this.router.get('/List', wrap(helpController.gethelpList))
        this.router.get('/status/:status', wrap(helpController.getHelpByStatus))
        this.router.get('/:Id', wrap(helpController.getHelpById))
        
        
    }
    
}

export const helpRoutes = new HelpRoutes();