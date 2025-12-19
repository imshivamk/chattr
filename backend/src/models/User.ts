import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'name is required'], unique: true },
    email: { type: String, required: [true, 'email is required'], unique: true, lowercase: true, trim:true},
    password:{ type: String, required: [true, 'password is required'], minlength: 6, select: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin :{type: Date, default: Date.now},
    isVerified : {type:Boolean, default: false},
    verificationCode : {type: String},
    verificationCodeExpiry : {type : Date || undefined},
    resetPasswordCode : {type : String},
    resetPasswordCodeExpiry : {type : Date || undefined}
    
}, { timestamps: true });

export default mongoose.model('User', userSchema);
