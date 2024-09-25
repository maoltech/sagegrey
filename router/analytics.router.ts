import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { analyticsController } from "../controller/analytics.controller";
import { wrap } from "../constants/response";

class AnalyticsRoutes{

    public router = Router();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes (){
        this.router.get('/rates', wrap(analyticsController.getCurrencyAnalytics))
        this.router.use(wrap(authMiddleWare.AuthenticateOnboardedUsers))
        this.router.get('/', wrap(analyticsController.getAnalytics))
    }
    
}

export const analyticsRoutes = new AnalyticsRoutes();