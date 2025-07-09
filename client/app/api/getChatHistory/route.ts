import { connectDB } from "@/lib/auth";
import Message from "@/models/message";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { chatId } = await req.json(); // ✅ Destructure as object
  await connectDB();

  const messages = await Message.find({ chatId }).sort({ timestamp: 1 });

  return NextResponse.json(messages);
}
