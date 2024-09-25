import { Request, Response } from "express";
import { authValidation } from "../validation/auth.validation";
import { User } from "../model/user.model";
import { Temp } from "../model/temp.model";
import {BadRequestResponse, CreatedResponse, SuccessResponse} from "../constants/response"
import { userService } from "../service/user.service";
import { jwtService } from "../service/JWT.service";
import { messages } from "../service/message.service";
import { FRONTEND_URL } from "../constants/environments";
import { twoFA } from "../service/TwoFA.service";
import { tokenGenerator } from 'maoltech-generate-otp';
import speakeasy from "speakeasy";
import { IRequest } from "../constants/interface";
import {notificationService}  from "../service/notification.service";
class AuthController{

    public SignUp = async(req: Request,res: Response) =>{

        const {error} = authValidation.signupAndSigninValidation(req.body)
        if (error) {
            const message ={ error: error.details[0].message }
            return BadRequestResponse(res, message);
        }
        const {email, username} = req.body;

        const existUser = await User.findOne({email: email.toLowerCase()})
        if(existUser){
            const message = "user already exists with this email"
            return BadRequestResponse(res,message)
        }

        const usernameExists = await User.findOne({username})
        if(usernameExists){
            const message = "user already exists with this username"
            return BadRequestResponse(res,message)
        }

        const user = await userService.createUser(req.body)

        const token = jwtService.createToken(user._id, user.email )

        const response = {
            userId: user._id,
            email: user.email,
            username: user.username,
            token: token.accessToken,
            refreshToken: token.refreshToken
            
        }

        return CreatedResponse(res, response)

    }

    public SignIn = async (req: Request, res: Response) => {

        const {error} = authValidation.signupAndSigninValidation(req.body)
        if (error) {
            const message ={ error: error.details[0].message }
            return BadRequestResponse(res, message);
        }

        const {email, password} = req.body;
        const user = await User.findOne({email: email.toLowerCase()})

        if (!user || !(await user.comparePassword(password))) {
            return BadRequestResponse(res, "Invalid email or password");
        }

        let token = jwtService.createToken(user._id, user.email)
        if(user.twoFactorEnabled){
            await twoFA.CreateTwoFA(user.email, user.twoFactorSecret );
            const verify = false;
            token = jwtService.createToken(user._id, user.email, verify);
        }
        
        const response = {
            token: token.accessToken,
            refreshToken: token.refreshToken,
            uses2FA: user.twoFactorEnabled
        }

        return SuccessResponse(res, response)

    }

    public enable2FA = async(req:IRequest, res:Response) => {
        await User.findByIdAndUpdate(req.userId, {twoFactorEnabled: true});
        const message = "success"
        return SuccessResponse(res, {message});
    }

    public disable2FA = async(req:IRequest, res:Response) => {
        await User.findByIdAndUpdate(req.userId, {twoFactorEnabled: false});
        const message = "success"
        return SuccessResponse(res, {message});
    }

    public verify2Fa = (req: IRequest, res: Response) => {
        
        const status = twoFA.verify2FA(req.user.twoFactorSecret, req.body.code)
        if(!status){
            const message = "Invalid 2FA code";
            return BadRequestResponse(res, message);
        }
        const verify = true;
        const token = jwtService.createToken(req.userId, req.userMail, verify);
        const response = {
            token: token.accessToken,
            refreshToken: token.refreshToken,
            uses2FA: req.user.twoFactorEnabled
        }

        return SuccessResponse(res, response)

    }

    public SendOtp = async(req: IRequest, res: Response) => {

        const {error} = authValidation.phoneValidation(req.params)
        if (error) {
            const message ={ error: error.details[0].message }
            return BadRequestResponse(res, message);
        }

        const { userId } = req;
        const { phone } = req.params;
        const user = await User.findById(userId)
        if (!user || user.isPhoneVerified == true ) {
            const message = "User already Verfied or does not exist";
            return BadRequestResponse(res, message);
        }

        // const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
        const otp = tokenGenerator.generateToken(6, 'numeric')
        const tempData = {
            otp,
            phone,
            userId
        }
        
        await Temp.create(tempData);
        const mail = `Thank you for registering  on sage-grey your otp is ${otp}`;
        // await messages.sendOTPMessage(mail, phone)
        const data = 'OTP sent successfully'
        return SuccessResponse(res, {data, otp})

    }

    public VerifyOtp = async(req: IRequest, res: Response) =>{
        const { phone, otp } = req.params
        const {userId} = req;
       
        const temp = await Temp.findOne({phone, otp})
        
        if(!temp){
            const message = "otp not verified"
            return BadRequestResponse(res,message)
        }
        const user = await User.findByIdAndUpdate(userId, {phone, isPhoneVerified: true})
        if(user){
            const data = "otp succesfully verified"
            return SuccessResponse(res, data)
        }
    }

    public SendEmail = async(req: IRequest, res: Response) => {

        const { userMail, userId } = req;

        // const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
        const otp = tokenGenerator.generateToken(6, 'numeric');
        const tempData = {
            otp,
            userId,
            email: userMail
        }

        await Temp.create(tempData);
        const url = `${process.env.FRONTEND_URL as string}/onboard?step=2&email=${userMail}&otp=${otp}`
        
        const mail = `<div>
                        Thank you for registering on sage-grey. Your OTP is ${otp}.
                        <br><br>
                        Click here to verify your email: <a href="${url}">Click here</a>
                        <br><br>
                        Or manually copy and paste this link into your browser: <br>
                        <a href="${url}">${url}</a>
                    </div>`;

        const subject = 'Verification-Mail'
        await messages.sendMailP(mail, userMail,subject)
        const data = 'OTP sent successfully'
        return SuccessResponse(res, {data})

    }

    public VerifyMail = async(req: Request, res: Response) =>{
        const { email, otp } = req.params;  
        
        const temp = await Temp.findOne({email, otp})
        
        if(!temp){
            const message = "otp not verified"
            return BadRequestResponse(res,message)
        }
        const user = await User.findOneAndUpdate({email}, { isEmailVerified: true})
        if(!user){
            const message = "user not found"
            return BadRequestResponse(res, message)
        }
        const token = jwtService.createToken(user._id, user.email )
        if(user){
            const data = {message: "otp succesfully verified", token}
            return SuccessResponse(res, data)
        }
    }

    public ChangePassword = async(req: IRequest, res: Response) => {
        const {error} = authValidation.changePasswordValidation(req.body)
        if (error) {
            const message ={ error: error.details[0].message }
            console.log({error})
            return BadRequestResponse(res, message);
        }

        try{
        const {userId, body} = req;
        const {newPassword, oldPassword} = body;
        const user = await User.findById(userId)

        if (!user || !(await user.comparePassword(oldPassword))) {
            return BadRequestResponse(res, "Invalid user or password");
        }

        user.password = newPassword
        await user.save();
        await notificationService.createNotification("Password Change Notification", "You changed your password", [`${user.id}}`])
        return SuccessResponse(res, {message: "Your password has been succesfully changed"})
    }catch(error: any){
        console.log({error: error.message})
        return BadRequestResponse(res, {message: error.message})
    }


    }

    public ForgotPassword = async(req: Request, res: Response)=>{
        const {error} = authValidation.emailValidation(req.body)
        if (error) {
            const message = { error: error.details[0].message }
            return BadRequestResponse(res, message);
        }
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            const message = "no user exist with this email"
            return BadRequestResponse(res, message);
        }

        const otp = tokenGenerator.generateToken(6, 'numeric')
        const tempData = {
            otp,
            email,
            userId: user._id
        }
        await Temp.create(tempData);
        const link = `${process.env.FRONTEND_URL as string}forgotpassword/?email=${email}&otp=${otp}`;
        const subject = 'Reset Your Password';
        const mail = `
            <p>Hello,</p>
            <p>We received a request to reset your password. Please use the following OTP to reset your password:</p>
            <p><strong>${otp}</strong></p>
            <p>If you didn't request this, you can ignore this email.</p>
            <p>Alternatively, you can click on the following link to reset your password:</p>
            <a href="${link}">Reset Password</a>
            <p>This OTP will expire in a short time for security reasons.</p>
            <p>Thank you,<br/>sage-grey Team</p>
        `;
        await messages.sendMailP(mail, email, subject);
        const data = 'Forgot password mail sent successfully';
        return SuccessResponse(res, { data, link });

    }

    public ResetPassword = async(req: Request, res: Response) => {
        const {error} = authValidation.resetPasswordValidation(req.body)
        if (error) {
            const message = { error: error.details[0].message }
            return BadRequestResponse(res, message);
        }
        const {token, email, newPassword} = req.body
        const temp = await Temp.findOne({email, otp: token})
        if(!temp){
            const message = "token or email not valid or has expired"
            return BadRequestResponse(res, message);  
        }
        const user = await User.findById(temp.userId)
        if(!user){
            const message ="user not found"
            return BadRequestResponse(res, message);    
        }
        user.password = newPassword;
        await  user.save();
        await notificationService.createNotification("Password Reset Notification", "You reset your password", [`${user.id}`])
        const data = 'Password succefully reset';
        return SuccessResponse(res, { data });
    }
    
}

export const authController = new AuthController();