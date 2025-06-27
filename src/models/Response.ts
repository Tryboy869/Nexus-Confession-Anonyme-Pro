
import mongoose, { Schema, Document } from 'mongoose';

export interface Response extends Document {
  originalMessage: mongoose.Types.ObjectId;
  responder: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const ResponseSchema: Schema<Response> = new Schema({
  originalMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  },
  responder: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Response as mongoose.Model<Response> || mongoose.model<Response>('Response', ResponseSchema);
