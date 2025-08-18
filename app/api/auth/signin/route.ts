/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";
import { signJWT, setAuthCookie } from "@/app/lib/jwt";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Check if email exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "No account is associated with this email address" },
                { status: 403 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid password, try another one." },
                { status: 403 }
            );
        }

        /**@todo Check if email is verified */
        if (!user.emailVerified) {
            return NextResponse.json(
                { error: "Please verify your email before signing in" },
                { status: 403 }
            );
        }


        // Create JWT token
        const token = await signJWT({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            emailVerified: user.emailVerified,
            location: user.location, // Assuming location is part of the user model
        });

        // Create response
        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                emailVerified: user.emailVerified,
                location: user.location, // Assuming location is part of the user model
            },
        },
            { status: 200 }
        );

        // Set auth cookie
        setAuthCookie(response, token);

        return response;
    } catch (error: any) {
        console.error("Signin error: ", error.message);
        return NextResponse.json(error.message || "Failed to sign in", { status: 403 });
    } finally {
        await prisma.$disconnect();
    }
}
