import  {Router} from "express";
import { onboardController } from "../controller/onboard.controller"
import { authMiddleWare } from "../middleware/auth.middleware";
import { wrap } from "../constants/response";


class OnBoardRoutes{

    public router = Router();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes (){
        this.router.use(wrap(authMiddleWare.notOnboardedUsers))
        this.router.post('/name', wrap(onboardController.OnboardName))
        this.router.post('/bvn', wrap(onboardController.OnboardBVN) )
        this.router.post('/address', wrap(onboardController.OnboardAddress))
        this.router.post('/picture', wrap(onboardController.onboardProfileImage))
        this.router.post('/complete', wrap(onboardController.completeOnboarding))
        this.router.post('/enable/otp', wrap(onboardController.enable2FA))
        this.router.post('/verify/otp', wrap(onboardController.verify2FA))
    }
    
}

export const onBoardRoutes = new OnBoardRoutes();