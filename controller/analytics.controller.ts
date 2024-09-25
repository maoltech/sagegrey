import { Request, Response } from "express"
import { IRequest } from "../constants/interface"
import { Analytics } from "../model/analytic.model"
import { BadRequestResponse, ServerResponse, SuccessResponse } from "../constants/response"
import { analyticService } from "../service/analytic.service"



class AnalyticsController {

    public getAnalytics =  async(req: IRequest, res: Response) => {
     
        const data = await analyticService.getUserAnalytics(req.userId)
        if(!data){
            const message = "analytics not found"
            return BadRequestResponse(res, message)
        }
        return SuccessResponse(res, data)
    }

    public getCurrencyAnalytics = async (req: Request, res: Response) => {
        try {
            const data = await analyticService.getTopCurrencyRate();
            return SuccessResponse(res, data);
        } catch (error) {
            console.log({error})
            return ServerResponse(res, error);
        }
    }
}

export const analyticsController = new AnalyticsController();