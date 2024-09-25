import { Response } from "express"
import { onboardValidation } from "../validation/onboard.validation"
import { BadRequestResponse, SuccessResponse } from "../constants/response"
import { User, UserBase } from "../model/user.model"
import { twoFA } from "../service/TwoFA.service"
import speakeasy from "speakeasy"
import { walletService } from "../service/wallet.service"
import { Wallet } from "../model/wallet.model"
import { IRequest } from "../constants/interface"
import { analyticService } from "../service/analytic.service"
import requestIp from 'request-ip';

class OnboardController {

    public OnboardName = async(req: IRequest, res: Response) => {
        const { error} = onboardValidation.onboardNameValidation(req.body)
        if(error) {
            const message ={ error: error.details[0].message }
            return BadRequestResponse(res, message); 
        }
        const {userId} = req
        const {firstName, lastName, dob} = req.body

        const user = await User.findById(userId)

        if (!user) {
            const message = "User not found";
            return BadRequestResponse(res, message);
        }
        // const customer = await walletService.flwCreateCustomer(user.email, user.firstName,  user.lastName);
        user.firstName = firstName
        user.lastName = lastName
        user.dob = dob
        // user.customerId = customer.data.data.id

        const updatedUser = await user.save()
        const {password, __v, bvn, twoFactorSecret, ...others } = updatedUser.toObject();

        return SuccessResponse(res, others);
    }

    public OnboardAddress = async (req: IRequest, res: Response) => {

        const {error} = onboardValidation.onboardAddressValidation(req.body);
        if(error) {
            const message ={ error: error.details[0].message }
            return BadRequestResponse(res, message);
        }

        const {userId} = req

        const user = await User.findByIdAndUpdate(userId, {address: req.body.address})

        if(!user){
            const message = "User not found"
            return BadRequestResponse(res, message);
        }

        const {password, __v, bvn, ...others} =  user.toObject();

        return SuccessResponse(res, others);

    };

    public OnboardBVN = async (req: IRequest, res: Response) => {
        const {error} = onboardValidation.onboardBVNValidation(req.body);
        if(error) {
            const message ={ error: error.details[0].message }
            return BadRequestResponse(res, message);
        } 

        const {userId} = req

        const user = await User.findByIdAndUpdate(userId, {bvn: req.body.bvn, isBvnVerified: true});

        if(!user){
            const message = "User not found"
            return BadRequestResponse(res, message);
        }

        const {password, __v, bvn, ...others} = user.toObject();

        return SuccessResponse(res, others);

    };

    public onboardProfileImage = async(req: IRequest, res: Response) => {
        const {userId, body} = req;
        if(!body.link){
            const message = "Pls add a link"
            return BadRequestResponse(res, message);
        }

        const user = await User.findByIdAndUpdate(userId, {profilePics: body.link}, {new: true})
        
        if(!user){
            const message = "User not found"
            return BadRequestResponse(res, message);
        }
        
        const {password, __v, bvn, ...others} = user.toObject();
        return SuccessResponse(res, others)
    }

    public completeOnboarding = async(req: IRequest, res:Response) => {
        const {userId} = req
        const user = await User.findById(userId)
        if(!user) {
            const message = "user not found"
            return BadRequestResponse(res, message)
        }
        // await walletService.flwCreateAccount(user.email, user.firstName,  user.lastName, user.customerId as Number, user.phone);
        const userWallet =  await Wallet.findOne({userId})
            if(userWallet){
                const message = "Wallet already exists"
                return BadRequestResponse(res, message);
            }

        // if(!user.isPhoneVerified){
        //     const message = "User is not phone verified"
        //     return BadRequestResponse(res, message);
        // }
            const response = await User.findByIdAndUpdate(userId, {isOnboarded: true}, {new: true});
            if(!response){
                const message = "User not found"
                return BadRequestResponse(res, message);
            }

            const {password, __v, bvn, ...others} =  response.toObject();
            if(!user.bvn){
                const message = "Pls insert your BVN first "
                return BadRequestResponse(res, message);
            }

           const data = await walletService.createAccount(user.email, user.bvn, userId)
           await analyticService.createAnalytics(userId)
           const result = {balance: data?.balance, account: data?.account_number, ...others}
            return SuccessResponse(res, result);


    }

    public enable2FA = async (req: IRequest, res: Response) => {
        const { userMail, userId } = req;
        const secret = speakeasy.generateSecret({ length: 20 });
        await User.findByIdAndUpdate(userId , { twoFactorSecret: secret});

        await twoFA.CreateTwoFA(userMail, secret)

        return SuccessResponse(res, {message: "2FA sent successfully"});
    }

    public verify2FA = async (req: IRequest, res: Response) => {
        const { userId, code } = req.body;

        const user = await User.findById(userId);
        if (!user || !user.twoFactorSecret) {
            const message = "2FA not enabled for the user";
            return BadRequestResponse(res, message);
        }

        
        const verified = twoFA.verify2FA(user.twoFactorSecret, code);
        if (verified) {
            const data = "2FA successfully verified";
            return SuccessResponse(res, data);
        } else {
            const message = "Invalid 2FA code";
            return BadRequestResponse(res, message);
        }
    }
}

export const onboardController = new OnboardController();