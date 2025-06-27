
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Le nom d'utilisateur est requis"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "L'email est requis"],
        unique: true,
        match: [/.+\@.+\..+/, 'Veuillez utiliser une adresse email valide']
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"]
    },
    verifyCode: String,
    verifyCodeExpiry: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    isPremium: {
        type: Boolean,
        default: false
    },
    messagesLeft: {
        type: Number,
        default: 3
    },
    referralCode: {
        type: String,
        unique: true,
    },
    referredBy: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
