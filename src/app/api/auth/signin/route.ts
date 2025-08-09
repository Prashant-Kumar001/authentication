import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }


    const token = {
      id: user._id,
      email: user.email,
      username: user.name,
    }

    const jwtToken = jwt.sign(token, process.env.NEXT_AUTH_JWT_SECRET || "", {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Sign-in successful",
      user: user,
      satisfied: true,
    });
    response.cookies.set("token", jwtToken, {
      httpOnly: true,
    });
    return response;


  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
