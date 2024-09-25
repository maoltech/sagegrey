// import { JWT_TOKEN_SECRET,  JWT_REFRESHTOKEN_SECRET} from "../constants/environments";
import jwt from 'jsonwebtoken';
import { User } from "../model/user.model";

interface DecodedToken {
    userId: string;
    email: string;
    verify: boolean;
  }
class JWTService{


    public createToken = ( userId: String, email: String, verify?: Boolean ) =>{
        if(verify == null){
            verify = true
        }
        const accessToken = jwt.sign({userId, email, verify}, process.env.JWT_TOKEN_SECRET as string, { expiresIn: '10h' });
        const refreshToken = jwt.sign({userId, email, verify}, process.env.JWT_REFRESHTOKEN_SECRET as string, { expiresIn: '7d' });
        return { accessToken, refreshToken };
                
    }

    public verifyAccessToken = async(token: string): Promise<any> => {
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET as string) as DecodedToken;
        if (!decodedToken.verify){
            return null;
        }
        const user = await User.findById(decodedToken.userId);
        if(!user){
            return null;
        }
        return user;

    }

    public verify2FAAccessToken = async(token: string): Promise<any> => {
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET as string) as DecodedToken;

        const user = await User.findById(decodedToken.userId);
        if(!user){
            return null;
        }
        return user;

    }
}

export const jwtService = new JWTService();