import { Response } from "express"


const CreatedResponse = (res: Response,data: any) => {
    return res.status(201).json(data);
}

const SuccessResponse = (res: Response,data: any) => {
    return res.status(200).json(data);
}

const BadRequestResponse = (res: Response, data: any) => {
    return res.status(400).json({message: data});
}

const ServerResponse = (res: Response, data: any) => {
    return res.status(500).json({message: data.messaage});
}
const wrap =
  (fn: any) =>
  (...args: any) =>
    Promise.resolve(fn(...args)).catch(args[2]);

export {
    CreatedResponse,
    SuccessResponse,
    BadRequestResponse,
    ServerResponse,
    wrap

}