import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { verifyToken } from "@/helper/utils";
import { User } from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
