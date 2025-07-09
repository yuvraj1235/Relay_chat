import { NextResponse } from "next/server";
import { connectDB } from "@/lib/auth";
import User from "@/models/user";
 export async function POST(req:Request){
    try {
        await connectDB();
        const {email}=await req.json();
        const user=await User.findOne({email}).select("_id")
        console.log("user",user);
        return NextResponse.json({user})
        
    } catch (error) {
        console.log(error);
        
    }
 }