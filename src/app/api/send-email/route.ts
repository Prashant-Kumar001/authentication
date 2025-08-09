import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helper/utils";
import { User } from "@/models/user";
import { sendVerificationEmail } from "@/helper/mailer";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const id = verifyToken(token);

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "User already verified" },
        { status: 400 }
      );
    } else {
      const result = await sendVerificationEmail({
        email: user.email,
        emailType: "VERIFY",
        userId: user._id as Types.ObjectId,
      });

       if (result && result.success) {
         return NextResponse.json(
           { message: "Verification email sent" },
           { status: 200 }
         );
       }

    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
