import Joi from "joi";
import { IBuyRequest, IOrderRequest, ISellRequest } from "../constants/interface";


class ExchangeValidation {

    public buyValidator = (data: IBuyRequest) =>{

        const schema = Joi.object({
            sellerId: Joi.string().required(),
            rate: Joi.number().required(),
            buyCurrency: Joi.string().required(),
            sellAmount: Joi.number().required(),
            buyAmount: Joi.number().required(),
            method: Joi.string().required(),
            sellerOfferId: Joi.string().required()
        })

        return schema.validate(data);
    }

    public sellValidator = (data: ISellRequest) =>{

        const schema = Joi.object({
            buyerId: Joi.string().required(),
            rate: Joi.number().required(),
            sellCurrency: Joi.string().required(),
            sellAmount: Joi.number().required(),
            buyAmount: Joi.number().required(),
            method: Joi.string().required(),
            buyerOfferId: Joi.string().required()
        })

        return schema.validate(data);
    }

    public orderValidator = (data: IOrderRequest) =>{

        const schema = Joi.object({
            offererId: Joi.string().required(),
            rate: Joi.number().required(),
            buyCurrency: Joi.string().required(),
            sellAmount: Joi.number().required(),
            buyAmount: Joi.number().required(),
            method: Joi.string().required(),
            OfferId: Joi.string().required(),
            type: Joi.string().required()
        })

        return schema.validate(data);
    }


}

export const exchangeValidation = new ExchangeValidation();