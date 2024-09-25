import Joi from "joi";
import { IOnboardData } from "../constants/interface";




class OnboardValidation {

    public onboardNameValidation = (data: IOnboardData) => {

        const schema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            dob: Joi.date().required()
        });

        return schema.validate(data);

    }

    public onboardAddressValidation = (data: IOnboardData) =>{

        const schema = Joi.object({
            address: Joi.string().required()
        });

        return schema.validate(data);
    }

    public onboardBVNValidation = (data: IOnboardData) =>{

        const schema = Joi.object({
            bvn: Joi.string().length(11).pattern(/^[0-9]+$/).required()
        });

        return schema.validate(data);
    }
}

export const onboardValidation = new OnboardValidation();