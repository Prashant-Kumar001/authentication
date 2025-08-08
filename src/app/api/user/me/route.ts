import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { verifyToken } from "@/helper/utils";
import { User } from "@/models/user";


export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const token = req.cookies.get("token")?.value || "";
        const id = verifyToken(token);
        const user = await User.findById(id).select("-password");
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}