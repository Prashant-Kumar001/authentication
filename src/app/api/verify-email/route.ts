import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body as { token: string } || {};


    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 400 });
    }


    const user = await User.findOne({
      verificationToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if(user.isVerified) {
      return NextResponse.json({ error: "User already verified" }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verifyTokenExpiry = undefined;
    user.verifiedAt = new Date();

    await user.save();

    return NextResponse.json({ message: "Verification successful" }, { status: 200 });
   
    
   
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
