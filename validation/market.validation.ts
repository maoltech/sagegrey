import Joi from "joi";


class MarketPlaceValidation {

    public buyerValidation = (data: any) => {
        
        const buySchema = Joi.object({
            buyCurrency: Joi.string().min(2).max(4).required(),
            rate: Joi.number().required(),
            minQuantity: Joi.number().required(),
            maxQuantity: Joi.number().required(),
            methods: Joi.array().required()
        })

        return buySchema.validate(data)
    };
    
    
    public sellerValidation = (data: any) => {
        
        const sellSchema = Joi.object({
            sellCurrency: Joi.string().min(2).max(4).required(),
            rate: Joi.number().required(),
            minQuantity: Joi.number().required(),
            maxQuantity: Joi.number().required(),
            methods: Joi.array().required()
        })

        return sellSchema.validate(data)
    };

}

export const marketPlaceValidation = new MarketPlaceValidation();