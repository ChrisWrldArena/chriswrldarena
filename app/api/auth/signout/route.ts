import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/app/lib/jwt";

export async function POST() {
    const response = NextResponse.json(
        { message: "Signed out successfully" },
        { status: 200 }
    );
    
    removeAuthCookie(response);
    return response;
}
