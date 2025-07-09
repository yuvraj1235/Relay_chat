import { connectDB } from "@/lib/auth";
import Message from "@/models/message";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { chatId, senderId, receiverId, message, timestamp } = body;

  await connectDB();
  const saved = await Message.create({ chatId, senderId, receiverId, message, timestamp });
  return NextResponse.json(saved);
}
