import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { marketPlaceController } from "../controller/market.controller";
import { wrap } from "../constants/response";


class MarketPlaceRoutes {

    public router = Router();

    constructor() {
        this.initializeRoutes()
    }

    public initializeRoutes = () => {

        this.router.use(wrap(authMiddleWare.AuthenticateOnboardedUsers))
        this.router.post('/buy', wrap(marketPlaceController.buy))
        this.router.post('/sell', wrap(marketPlaceController.sell))
        this.router.get('/buy/list', wrap(marketPlaceController.buyList))
        this.router.get('/sell/list', wrap(marketPlaceController.sellList))
        this.router.get('/:id', wrap(marketPlaceController.offerById))
    }

}

export const marketPlaceRoutes = new MarketPlaceRoutes();