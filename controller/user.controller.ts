import { Request, Response } from "express"
import { BadRequestResponse, ServerResponse, SuccessResponse } from "../constants/response"
import { User } from "../model/user.model"
import { userValidation } from "../validation/user.validator"
import { IRequest } from "../constants/interface"



class UserController {

    public getUser = (req: IRequest, res: Response) =>{
        try {
            
            const { user } = req
            SuccessResponse(res, user)

        } catch (error: any) {
            BadRequestResponse(res, error.message)
        }

    }

    public getUserByUsername = async(req: Request, res: Response) =>{
        try {
            
            const getUser = await User.findOne({username: req.params.username})
            if(!getUser){
                const message = "User not found"
                return BadRequestResponse(res, message)
            }
            const {bvn, twoFactorSecret, password, isOnboarded, isAdmin, __v, dob, ...user} = getUser.toObject();
            return SuccessResponse(res, user)

        }catch(error: any){
            console.log(error);
            return ServerResponse(res, {message: error.message});
        }

    }

    public updateUser = async(req: IRequest, res:Response) => {
        const {userId, body} = req
        const {error} = userValidation.updateUserValidation(body)
        if(error) {
            const message ={ error: error.details[0].message }
            return BadRequestResponse(res, message); 
        }

        const data = await User.findByIdAndUpdate(userId, {body})
        if(!data){
            const message = "User not found"
            return BadRequestResponse(res, message)
        }
        const {password, bvn, __v, ...others} = data.toObject();
        return SuccessResponse(res, others)


    }
}

export const userController = new UserController();