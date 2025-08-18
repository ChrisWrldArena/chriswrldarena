import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/jwt";

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();        

        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { error: "Authentication check failed" },
            { status: 500 }
        );
    }
}
