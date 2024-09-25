import { Router, Request, Response } from 'express';
import { authController } from '../controller/auth.controller';
import { authMiddleWare } from "../middleware/auth.middleware";
import { wrap } from '../constants/response';

interface IAuth {
    router: Router;
}

class AuthRoutes {
    public router= Router();

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes () {
        this.router.post('/signup', authController.SignUp)
        this.router.post('/signin', authController.SignIn)
        this.router.get('/verify/email/link/:email/:otp', authController.VerifyMail)
        this.router.put('/forgot/password', authController.ForgotPassword)
        this.router.put('/reset/password', authController.ResetPassword)
        this.router.post('/2fa/verify', wrap(authMiddleWare.AuthenticatWith2FAUsers), wrap(authController.verify2Fa))
        this.router.use(wrap(authMiddleWare.notOnboardedUsers))
        this.router.post('/2fa/enable', wrap(authController.enable2FA))
        this.router.post('/2fa/disable', wrap(authController.disable2FA))
        this.router.get('/create/phone/otp/:phone', wrap(authController.SendOtp))
        this.router.get('/verify/phone/otp/:phone/:otp', wrap(authController.VerifyOtp))
        this.router.get('/create/email/link', wrap(authController.SendEmail))
        this.router.put('/change/password', wrap(authController.ChangePassword))
    }
}

export const authRoutes = new AuthRoutes();