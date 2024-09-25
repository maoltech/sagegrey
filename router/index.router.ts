import { Router} from "express";
import { authRoutes } from "./auth.router";
import { onBoardRoutes } from "./onboard.router";
import { otherRoutes } from "./others.router";
import { transactionRoutes } from "./transaction.router";
import { marketPlaceRoutes } from "./market.router";
import { userRoutes } from "./user.router";
import { walletRoutes } from "./wallet.router";
import { exchangeRoutes } from "./exchange.router";
import { analyticsRoutes } from "./analytics.router";
import { helpRoutes } from "./help.router";
import { notificationRoutes } from "./notification.router";
 class Routes{

    public router: Router

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes = async() => {
        this.router.use('/auth', authRoutes.router);
        this.router.use('/onboard',   onBoardRoutes.router);
        this.router.use('/others',   otherRoutes.router);
        this.router.use('/transaction', transactionRoutes.router);
        this.router.use('/market', marketPlaceRoutes.router);
        this.router.use('/user', userRoutes.router);
        this.router.use('/wallet', walletRoutes.router);
        this.router.use('/exchange', exchangeRoutes.router);
        this.router.use('/analytic', analyticsRoutes.router);
        this.router.use('/help', helpRoutes.router);
        this.router.use('/notification', notificationRoutes.router);

    }
}


export const routes = new Routes();