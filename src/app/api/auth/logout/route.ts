import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {

        const res = NextResponse.json({ message: "Logout successful" }, { status: 200 });
        res.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
        return res;

    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
