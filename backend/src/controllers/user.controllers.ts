import { Request, Response } from "express";
import { IAuthRequest } from "../types/types.js";
import User from "../models/User.js";

export const getUserInfo = async (req:IAuthRequest, res:Response) =>{
    try {
        const user = await User.findById(req.userId).select(
            "-password -verificationCode -resetPasswordCode"
        );

        if(!user){
            return res.status(404).json({
                success:false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.error("Error fetching user details", error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}