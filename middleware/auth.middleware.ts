import { Response, Request, NextFunction } from "express";
import { BadRequestResponse } from "../constants/response";
import { jwtService } from "../service/JWT.service";
import { IRequest } from "../constants/interface";

export interface MiddlewareRequest extends Request {
  userId?: string;
  userMail: string;
}

class AuthMiddleware {

  public AuthenticateOnboardedUsers = async (req: IRequest, res: Response, next: NextFunction) => {

    const bearerToken = req.header('Authorization');

    if(!bearerToken){
      const message = 'Unauthorized - No bearer token available'
      return BadRequestResponse(res, message);
    }
  
    const token = bearerToken.split(" ") 

    if (!token[1]) {
        const message = 'Unauthorized - Token not provided'
      return BadRequestResponse(res, message);
    }

    try {

      const user = await jwtService.verifyAccessToken(token[1])
      if (!user) {
        const message = 'Unauthorized - User not found' 
        return BadRequestResponse(res, message);
      }
      if(user)

      if(!user.isOnboarded){
        const message = "User hasn't onboarded"
        return BadRequestResponse(res, message);

      }
      const {password, twoFactorSecret, bvn, ...others} = user.toObject();
      req.userId = user._id;
      req.userMail = user.email;
      req.user = others;
  
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

  };

  public notOnboardedUsers = async (req: IRequest, res: Response, next: NextFunction) => {

    const bearerToken = req.header('Authorization');
    if(!bearerToken){
      const message = 'Unauthorized - No bearer token available'
      return BadRequestResponse(res, message);
    }
    const token = bearerToken.split(" ")
  
    if (!token[1]) {
        const message = 'Unauthorized - Token not provided'
        return BadRequestResponse(res, message);
    }

  
    try {

      const user = await jwtService.verifyAccessToken(token[1])
      if (!user) {
        const message = 'Unauthorized - User not found' 
        return BadRequestResponse(res, message);
      }
      const {password, twoFactorSecret, bvn, ...others} = user.toObject();

      req.userId = user._id;
      req.userMail = user.email;
      req.user = others
  
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

  };

  public socketAuthMiddleware = async (socket: any, next: NextFunction): Promise<any> => {

    const bearerToken = socket.handshake.auth.token;
    if(!bearerToken){
      const message = 'Unauthorized - No bearer token available'
      return next(new Error (message));
    }
  
    const token = bearerToken.split(" ") 

    if (!token[1]) {
        const message = 'Unauthorized - Token not provided'
        return next(new Error (message));
    }

    const user = await jwtService.verifyAccessToken(token[1])
    if (!user) {
      const message = 'Unauthorized - User not found' 
      return next(new Error (message));
    }

    if(!user.isOnboarded){
      const message = "User hasn't onboarded"
      return next(new Error (message));

    }
    const {password, twoFactorSecret, bvn, ...others} = user.toObject();
    socket.userId = user._id;
    socket.userMail = user.email;
    socket.user = others;
    return next();
  };

  public AuthenticatWith2FAUsers = async (req: IRequest, res: Response, next: NextFunction) => {

    const bearerToken = req.header('Authorization');

    if(!bearerToken){
      const message = 'Unauthorized - No bearer token available'
      return BadRequestResponse(res, message);
    }
  
    const token = bearerToken.split(" ") 

    if (!token[1]) {
        const message = 'Unauthorized - Token not provided'
      return BadRequestResponse(res, message);
    }

    try {

      const user = await jwtService.verify2FAAccessToken(token[1])
      if (!user) {
        const message = 'Unauthorized - User not found' 
        return BadRequestResponse(res, message);
      }

      if(!user.isOnboarded){
        const message = "User hasn't onboarded"
        return BadRequestResponse(res, message);

      }
      const {password, bvn, ...others} = user.toObject();
      req.userId = user._id;
      req.userMail = user.email;
      req.user = others;
  
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

  };
}

export const authMiddleWare =  new AuthMiddleware();


// import { RequestHandler, Response, Request, NextFunction } from 'express';
// import { BadRequestResponse } from '../constants/response';
// import { jwtService } from '../service/JWT.service';

// export interface MiddlewareRequest extends Request {
//   userId: string;
//   userMail: string;
// }

// class AuthMiddleware {
//   public authenticateTokenHandler: (
//     req: MiddlewareRequest,
//     res: Response,
//     next: NextFunction
//   ) => Promise<Response<any, Record<string, any>> | undefined> = async (req, res, next) => {
//     const token = req.header('Authorization');

//     if (!token) {
//       const message = 'Unauthorized - Token not provided';
//       return BadRequestResponse(res, message);
//     }

//     try {
//       const user = await jwtService.verifyAccessToken(token);
//       if (!user) {
//         const message = 'Unauthorized - User not found';
//         return BadRequestResponse(res, message);
//       }

//       req.userId = user.userId;
//       req.userMail = user.email;

//       next();
//     } catch (error) {
//       return res.status(401).json({ error: 'Unauthorized - Invalid token' });
//     }
//   };

//   public authenticateToken: RequestHandler<{}, any, any, MiddlewareRequest> =
//     this.authenticateTokenHandler;
// }

// export const authMiddleWare = new AuthMiddleware();
