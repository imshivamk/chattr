import { NextFunction, Request, Response } from "express";
import { ratelimit } from "../lib/upstash.js";
import { IAuthRequest } from "../types/types.js";

export const rateLimiter = async (req:IAuthRequest, res:Response, next:NextFunction) => {
    const limitKey = req.userId;
    const {success} = await ratelimit.limit(limitKey as string);

    if(!success){
        return res.status(429).json({
            success: false,
            message: "Too many requests! try again later"
        })
    }
}