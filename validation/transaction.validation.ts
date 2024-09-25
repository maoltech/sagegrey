import Joi from "joi";
import { IVerifyAccountRequest, IWithdrawRequest } from "../constants/interface";

class TransactionValidation {

    public withdrawRequest = (data: IWithdrawRequest) =>{

        const schema = Joi.object({
            account_bank: Joi.string().required(),
            account_number: Joi.string().required(),
            amount: Joi.number().required(),
            narration: Joi.string().optional(),
            currency: Joi.string()  
        })

        return schema.validate(data);
    }

    public verifyAccountRequest = (data: IVerifyAccountRequest) =>{

        const schema = Joi.object({
            account_number: Joi.string().required(),
            account_bank: Joi.string().required()
        })

        return schema.validate(data)
    }
}

export const transactionValidation = new TransactionValidation();