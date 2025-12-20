import mongoose from "mongoose";

export default mongoose.model(
    "Message",
    new mongoose.Schema({
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            trim: true,
            maxlength: 2000,
            image: {
                type: String
            }
        }
    }, { timestamps: true })
)
