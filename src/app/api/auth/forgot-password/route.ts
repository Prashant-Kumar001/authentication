import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helper/utils";
import { User } from "@/models/user";
import { sendVerificationEmail } from "@/helper/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body as { email: string } || {};


    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.forGotPasswordToken) {
      return NextResponse.json(
        { error: "You have already requested a password reset" },
        { status: 400 }
      );
    } else {
      const result = await sendVerificationEmail({
        email: user.email,
        emailType: "RESET",
        userId: user._id,
      });

      if (result && result.success) {
        return NextResponse.json(
          { message: "password reset email sent to your email" },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
