import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String, // A unique ID combining sender + receiver OR group ID
      required: true,
    },
    senderId: {
      type: String, // Firebase UID or MongoDB ObjectId as string
      required: true,
    },
    receiverId: {
      type: String, // Firebase UID or group ID
      required: true,
    },
    message: {
      type: String, // message text
      default: '',
    },
    mediaUrl: {
      type: String, // image/audio/video URL if any
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file'],
      default: 'text',
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'seen'],
      default: 'sent',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
