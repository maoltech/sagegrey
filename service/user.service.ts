import { User } from "../model/user.model"
import bcrypt from "bcrypt";

interface CreateUserType{
    email: string,
    password: string,
    username: string
}

class UserService{

    public createUser = async(data: CreateUserType) => {
        const salt = await bcrypt.genSalt(5);
        const secertes = await bcrypt.hash(data.username, salt);
        const payload = {...data, twoFactorSecret: secertes}
        return await User.create(payload);
    }
}

export const userService = new UserService();