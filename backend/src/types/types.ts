import { JwtPayload } from "jsonwebtoken";
import { type Request } from "express";

export interface IAuthRequest extends Request{
    userId?: string | JwtPayload;
}

export interface IJwtPayload extends JwtPayload{
    userId: string;
}
