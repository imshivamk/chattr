import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { type Request, type Response, type NextFunction } from 'express';
import { IAuthRequest, IAuthSocket, IJwtPayload } from '../types/types.js';
import { Socket } from 'socket.io';

export const verifyToken = (
    req:IAuthRequest,
    res:Response,
    next:NextFunction
) : void => {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
        res.status(401).json({ message: 'Access Denied. No token provided.' });
        return;
    }

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as IJwtPayload;

        if (!decodedToken || !decodedToken.userId) {
            res.status(400).json({ message: 'Invalid token.' });
            return;
        }

        req.userId = decodedToken.userId;
        next();
        
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ message: 'Failed to authenticate token.' });
        return;
    }

}

export const verifySocketToken = (
    socket: IAuthSocket,
    next: (err?: Error) => void ) => {
    const token = socket.handshake.headers.cookie
    ?.split("; ").find((row)=> row.startsWith("token="))
    ?.split("=")[1];

    if(!token) return next(new Error("Unauthorized!"));

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as IJwtPayload;


        socket.userId = decodedToken.userId;
        next();
        
    } catch (error) {
        next(new Error("Unauthorized - Invalid Token"));
    }
}

