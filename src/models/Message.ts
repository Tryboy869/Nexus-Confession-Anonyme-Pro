
import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
  content: string;
  createAt: Date;
  isAcceptingMessages: boolean;
  messageType: 'feedback' | 'journal';
  template: string;
  isReviewedByModerator: boolean;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: [true, 'Le contenu du message ne peut pas être vide.'],
    maxLength: [300, 'Le contenu ne peut pas dépasser 300 caractères.'],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messageType: {
    type: String,
    enum: ['feedback', 'journal'],
    required: true,
    default: 'feedback',
  },
  template: {
    type: String,
    default: 'libre',
  },
  isReviewedByModerator: {
      type: Boolean,
      default: false
  }
});

export default mongoose.models.Message as mongoose.Model<Message> || mongoose.model<Message>('Message', MessageSchema);
