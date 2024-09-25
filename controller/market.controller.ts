import { Response } from "express"
import { marketPlaceValidation } from "../validation/market.validation"
import { BadRequestResponse, SuccessResponse } from "../constants/response"
import { Buyer, Seller } from "../model/offer.model"
import { marketPlaceService } from "../service/market.service"
import { IRequest } from "../constants/interface"
import { notificationService } from "../service/notification.service"


class MarketPlaceController {

    public buy = async(req: IRequest, res: Response) => {
       
        const {error} = marketPlaceValidation.buyerValidation(req.body)
        if(error) {
            const message ={ error: error.details[0].message }
            return BadRequestResponse(res, message); 
        }

        const {userId, body, user} = req

        const payload = {
            ...body,
             userId,
            username: user.username
        }
    
        const response = await Buyer.create(payload)
       await notificationService.createNotification("Buy Offer Notification", "Buy Offer created", [`${payload.userId}`])
        SuccessResponse(res, response)
    }
    
    public sell = async(req: IRequest, res: Response) => {
       
        const {error} = marketPlaceValidation.sellerValidation(req.body)
        if(error) {
            const message = { error: error.details[0].message }
            return BadRequestResponse(res, message); 
        }

        const {userId, body, user} = req

        const payload = {
            ...body,
             userId,
            username: user.username
        }
    
        const response = await Seller.create(payload)
        await notificationService.createNotification("Sell Offer Notification", "Sell Offer created", [`${payload.userId}`])
        SuccessResponse(res, response)
    }

    public buyList = async(req: IRequest, res: Response) => {

        const {page, count, methods, currency, amount } = req.query;
        const pageNum = parseInt(page as string) || 1;
        const countPerPage = parseInt(count as string) || 10;
        const skip = (pageNum - 1) * countPerPage;

        const response = await marketPlaceService.buyersList(
            skip, 
            countPerPage,
            pageNum,
            req.userId,
            methods as string,
            currency as string,
            amount as string,
            
        )

        SuccessResponse(res, response)

    }

    public sellList = async(req: IRequest, res: Response) => {

        const {page, count, methods, currency, amount } = req.query;
        const pageNum = parseInt(page as string) || 1;
        const countPerPage = parseInt(count as string) || 10;
        const skip = (pageNum - 1) * countPerPage;

        const response = await marketPlaceService.sellersList(
            skip, 
            countPerPage,
            pageNum,
            req.userId,
            methods as string,
            currency as string,
            amount as string)

        SuccessResponse(res, response)
        return
    }

    public offerById = async(req:IRequest, res:Response) => {
        try{
            const response = await marketPlaceService.getOfferById(req.params.id)
            SuccessResponse(res, response)
            return
        }catch(error: any){
            const message = error.mesaage
            return BadRequestResponse(res, message); 
        }
    }
}

export const  marketPlaceController = new MarketPlaceController();