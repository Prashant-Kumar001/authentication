import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helper/utils";
import { User } from "@/models/user";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(
      { message: "Verification has been sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
