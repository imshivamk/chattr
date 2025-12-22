import { Response } from "express"
import { IAuthRequest } from "../types/types.js"
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";



export const getAllContacts = async (req: IAuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const contacts = await User.find({
            _id: { $ne: userId }
        }).select('-password -verificationCode -resetPasswordCode')
        res.status(200).json({
            success: true,
            contacts
        });
    } catch (error) {
        console.error("Error in getAllContacts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const GetMessagesByUserId = async (req: IAuthRequest, res: Response) => {
    try {
        const myId = req.userId;
        const friendId = req.params.id;

        const messages = await Message.find(
            {
                $or: [
                    { senderId: myId, receiverId: friendId },
                    { senderId: friendId, receiverId: myId }
                ]
            }
        )

        res.status(200).json({
            messages
        })

    } catch (error) {
        console.error("Error in GetMessagesByUserId:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req: IAuthRequest, res: Response) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id as string;
        const senderId = req.userId as string;

        if ((!text || text.trim().length === 0) && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }

        if (senderId === receiverId) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }

        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        let imageUrl: string | undefined;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image); // supports base64/Data URI uploads.[web:6][web:9]
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        const savedMessage = await newMessage.save();

        return res.status(201).json({
            message: "Message sent successfully.",
            data: savedMessage,
        });
    } catch (error) {
        console.error("Error in sendMessage:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getChats = async (req: IAuthRequest, res: Response) => {

    try {
        const myId = req.userId as string;

        const messages = await Message.find({
            $or: [
                { senderId: myId },
                { receiverId: myId }
            ]
        }).select('senderId receiverId');

        let chats = messages.map((message) => {
            return (message.senderId.toString() === myId) ? message.receiverId.toString() : message.senderId.toString();
        })

        chats = [
            ... new Set(chats)
        ]

        const chatPartners = await User.find({
            _id: {
                $in: chats
            }
        }).select('-password -verificationCode -resetPasswordCode');

        res.status(200).json({
            chatPartners
        })

    } catch (error) {
        console.error("Error in getChats:", error);
        res.status(500).json({ message: "Internal server error" });
    }




}

