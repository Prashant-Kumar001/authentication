import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import dbConnect from "@/config/db";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { token, newPassword: password } =
      (body as { token: string; newPassword: string }) || {};


    if (!token) {
      return NextResponse.json({ error: "Token not found" }, { status: 400 });
    }
    if(!password) {
      return NextResponse.json({ error: "Password not found" }, { status: 400 });
    }

    console.log(token);


    const user = await User.findOne({
      forGotPasswordToken: token,
      forGotPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }



    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.forGotPasswordToken = undefined;
    user.forGotPasswordExpires = undefined;



    await user.save();

    return NextResponse.json({ message: "Password updated" }, { status: 200 });



  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
