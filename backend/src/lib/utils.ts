import jwt, { SignOptions } from "jsonwebtoken";
import { type Response } from "express";

interface JwtPayload {
  userId: string;
  email: string;
}

// verification and reset code generation

export const generateVerificationCode = (): string => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min) + min).toString();
};

export const generateResetCode = (): string => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min) + min).toString();
};

// JWT Token generation and verification

export const generateToken = (userId: string, email: string): string => {
  const payload: JwtPayload = { userId, email };
  const secret = process.env.JWT_SECRET as string;
  const options = { expiresIn: "1h" } as SignOptions;

  console.log("Generating token with payload:", payload);
  return jwt.sign(payload, secret, options);
};

export const generateTokenAndSetCookie = (
  res: Response,
  userId: string,
  email: string
) : string => {

  const token = generateToken(userId, email);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  console.log("saving cookie");
  res.cookie("token", token, cookieOptions);
  console.log("cookie saved");
  return token;
};
