import { jwtService } from "../service/JWT.service";
import { BadRequestResponse } from "../constants/response";
import { IRequest } from "../constants/interface";
import { NextFunction, Response } from "express";
import { authMiddleWare } from "./auth.middleware";

jest.mock("../service/JWT.service");
jest.mock('../constants/response');

describe('AuthMiddleWare', ()=>{
    let req: Partial<IRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() =>{
        req = {
            header: jest.fn()
        };
        res = {
            status: jest.fn().mockReturnThis(),
        };
        next: jest.fn();
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("authentication for onboarded users", () =>{

        it("it should return unthaurized if no token", async() =>{
            (req.header as jest.Mock).mockReturnValue(null)

            await authMiddleWare.AuthenticateOnboardedUsers(req as IRequest, res as Response, next);

            expect(BadRequestResponse).toHaveBeenCalledWith(res, 'Unauthorized - No bearer token available');
        })

        /*
        it("check for invlaid token", async() => {
            (req.header as jest.Mock).mockReturnValue("Bearer InvalidToken")
            (jwtService.verifyAccessToken as jest.Mock).mockRejectedValueOnce(new Error("Invalid Token"))

            await authMiddleWare.AuthenticateOnboardedUsers(req as IRequest, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - User not found' });
        })*/

        it("if the user is not found", async() =>{
            // const user = { isOnboarded: false, toObject: jest.fn().mockReturnValue({}) };
            const user = false;
            (req.header as jest.Mock).mockReturnValue("Bearer Token")
            (jwtService.verifyAccessToken as jest.Mock).mockResolvedValue(user)

            await authMiddleWare.AuthenticateOnboardedUsers(req as IRequest, res as Response, next)
            expect(BadRequestResponse).toHaveBeenCalledWith(res, "Unauthorized - User not found");
        })


        it('should call next if user is onboarded', async () => {
            const user = { _id: '123', email: 'test@example.com', isOnboarded: true, toObject: jest.fn().mockReturnValue({}) };
            (req.header as jest.Mock).mockReturnValue('Bearer validToken');
            (jwtService.verifyAccessToken as jest.Mock).mockResolvedValue(user);
    
            await authMiddleWare.AuthenticateOnboardedUsers(req as IRequest, res as Response, next);
    
            expect(req.userId).toEqual('123');
            expect(req.userMail).toEqual('test@example.com');
            expect(next).toHaveBeenCalled();
        });
    })
})
