import { Request, Response } from "express"
import { IRequest } from "../constants/interface"
import { helpService } from "../service/help.service";
import { ServerResponse, SuccessResponse } from "../constants/response";
import { helpStatus } from "../model/help.model";



class HelpController {

    public async create(req: IRequest, res: Response): Promise<any> {
        try{
            const data = {userId: req.userId, ...req.body}
            const response = await helpService.createHelp(data)
            SuccessResponse(res, response)
        }catch(error:any){
            console.log(error)
            return ServerResponse(res, {message: error.message});
        }
    }

    public async gethelpList(req: IRequest, res: Response): Promise<any>{
        try{
            const response = await helpService.getHelpList(req.userId)
            SuccessResponse(res, response)
        }catch(error:any){
            console.log(error)
            return ServerResponse(res, {message: error.message});
        }
    }

    public async getHelpById(req: IRequest, res: Response): Promise<any>{
        try{
            const response = await helpService.getHelpById(req.params.Id)
            SuccessResponse(res, response)
        }catch(error:any){
            console.log(error)
            return ServerResponse(res, {message: error.message});
        }
    }

    public async getHelpByStatus(req: IRequest, res: Response): Promise<any>{
        try{
            const response = await helpService.getHelpByStatus(req.params.status as helpStatus);
            SuccessResponse(res, response)
        }catch(error:any){
            console.log(error)
            return ServerResponse(res, {message: error.message});
        }
    }
}

export const helpController = new HelpController();