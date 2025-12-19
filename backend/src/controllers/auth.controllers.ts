    import bcrypt from "bcryptjs";
    import crypto from "crypto";
    import { Request, Response } from "express";
    import User from "../models/User.js";

    import {
        generateTokenAndSetCookie,
        generateVerificationCode,
        generateResetCode,
    } from "../lib/utils.js";
    import {
        resetPasswordEmailTemplate,
        sendEmail,
        verificationEmailTemplate,
    } from "../lib/nodemailer.js";
    import { IAuthRequest } from "../types/types.js";

    export const signup = async (req: Request, res: Response) => {
        //  take email, nae, password  //
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            res.status(400).json({
                message: "Email, username and password are required!!!",
            });
            return;
        }
        // if already registered
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
            return;
        }

        // if all validations pass
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationCode = generateVerificationCode();
            const verificationCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

            const user = new User({
                email: email,
                name: name,
                password: hashedPassword,
                verificationCode: verificationCode,
                verificationCodeExpiry: verificationCodeExpiry,
            })

            await user.save();
            await sendEmail(
                user.email,
                "Verify your email",
                verificationEmailTemplate(verificationCode)
            );
            generateTokenAndSetCookie(res, user._id.toString(), user.email);

            res.status(201).json({
                success: true,
                message: "User registered successfully. Please verify your email.",
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Error while registering user",
            });
        }


    }

    export const login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email }).select("+password");
            if (!user) {
                return res.status(400).json({ message: "Invalid email or password" });
            }
            if (!user.isVerified) {
                return res.status(400).json({ message: "Email not verified" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                generateTokenAndSetCookie(res, user._id.toString(), user.email);
                user.lastLogin = new Date();
                await user.save();
                return res.status(200).json({ message: "Login successful" });
            }
            else {
                return res.status(400).json({ message: "Invalid email or password" });
            }

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error });
        }
    }

    export const logout = async (req: Request, res: Response) => {

        res.clearCookie('token');

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }

    export const checkAuth = async (req: IAuthRequest, res: Response) => {
        try {
            const user = await User.findById(req.userId).select(
                "-password -verificationCode -resetPasswordCode"
            );
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            res.status(200).json({
                success: true,
                user,
            });
        } catch (error: any) {
            console.error("Error while checking auth");
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    };

    export const verifyEmail = async (req: Request, res: Response) => {
        //user enters verification code from email  //
        const { verificationCode, email } = req.body;
        if (!verificationCode || !email) {
            res.status(400).json({
                message: "Email and verification code are required!!!",
            });
            return;
        }



        try {
            const user = await User.findOne({ email: email });
            // user doesnt exist
            if (!user) {
                res.status(400).json({ message: "User not found!!!" });
                return;
            }
            // already verified
            if (user.isVerified) {
                res.status(400).json({ message: "Already verified!!!" });
                return;
            }

            console.log(user.verificationCodeExpiry);
            console.log(new Date(Date.now()));


            // verification code expired
            if (user.verificationCodeExpiry && (user.verificationCodeExpiry) < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: "Verification code expired"
                })
            }

            // if all correct
            if (user.verificationCode === verificationCode) {
                user.isVerified = true;
                user.verificationCode = "";
                user.verificationCodeExpiry = undefined;
                await user.save();

                res.status(200).json({
                    success: true,
                    message: "Email verified successfully!",
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Verification code expired",
                });
                return;
            }
        } catch (error) {
            console.error("Error verifying email");
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    export const forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        const resetPasswordCode = crypto.randomBytes(20).toString("hex");
        const resetPasswordCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

        user.resetPasswordCode = resetPasswordCode;
        user.resetPasswordCodeExpiry = resetPasswordCodeExpiry;
        await user.save();

        await sendEmail(
            user.email,
            "Password Reset Request",
            resetPasswordEmailTemplate(
                `${process.env.CLIENT_URL}/reset-password/${resetPasswordCode}`
            )
        );

        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully",
        });
    };

    export const resetPassword = async (req: Request, res: Response) => {
        const { resetPasswordCode } = req.params;
        const { password } = req.body;

        try {
            const user = await User.findOne({
                resetPasswordCode: resetPasswordCode,
                resetPasswordCodeExpiry: { $gt: new Date() },
            });

            if (!user) {
                res.status(400).json({
                    message: "User not found!",
                });
                return;
            }

            user.password = await bcrypt.hash(password, 10);
            user.resetPasswordCode = "";
            user.resetPasswordCodeExpiry = undefined;
            user.save();
            res.status(200).json({
                success: true,
                message: "Password reset successfully"
            })
            
        } catch (error) {
            console.error("Error while resetting password");
            res.status(400).json({
                success: false,
                message: "Internal server error",
            });
        }
    };


