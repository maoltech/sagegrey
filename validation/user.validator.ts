import Joi from "joi";
import { IUserData } from "../constants/interface";




class UserValidation {

    public updateUserValidation = (data: IUserData) => {

        const schema = Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string(),
            dob: Joi.date(),
            address: Joi.string(),
            bvn: Joi.string().length(11).pattern(/^[0-9]+$/),
            profilePics: Joi.string()
        });

        return schema.validate(data);

    }


}

export const userValidation = new UserValidation();