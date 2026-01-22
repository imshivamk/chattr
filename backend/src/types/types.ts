import { JwtPayload } from "jsonwebtoken";
import { type Request } from "express";
import { Socket } from "socket.io";

export interface IAuthRequest extends Request{
    userId?: string | JwtPayload;
}

export interface IJwtPayload extends JwtPayload{
    userId: string;
}

export interface IAuthSocket extends Socket{
    userId?: string | JwtPayload;

}
