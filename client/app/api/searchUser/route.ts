import { connectDB } from "@/lib/auth";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query, currentUserEmail } = await req.json();
  await connectDB();

  const users = await User.find({
    $and: [
      { email: { $regex: query, $options: "i" } },
      { email: { $ne: currentUserEmail } }
    ]
  }).select("name email");

  return NextResponse.json(users);
}
