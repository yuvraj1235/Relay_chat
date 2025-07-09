import { connectDB } from "@/lib/auth";
import Message from "@/models/message.js"
// POST /api/messages
export async function POST(req:Request) {
  const { senderId, receiverId, message } = await req.json();
  const chatId = [senderId, receiverId].sort().join("_");

  await connectDB();

  const newMessage = await Message.create({
    chatId,
    senderId,
    receiverId,
    message,
  });

  return Response.json(newMessage);
}
