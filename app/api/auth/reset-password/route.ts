import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { sendPasswordResetEmail } from "@/app/lib/email";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

// Schema for request to send reset password email
const requestResetSchema = z.object({
    email: z.string().email("Invalid email address"),
});

// Schema for resetting password
const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(6, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = requestResetSchema.parse(body);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "If a user with this email exists, a password reset email has been sent." },
                { status: 200 }
            );
        }

        // Generate reset token and expiry
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Hash the reset token before storing in DB
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Save reset token and expiry to user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: hashedToken,
                resetTokenExpiry,
            },
        });

        // Create reset URL
        const resetUrl = `${process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_DEV_APP_URL : process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        // Send reset email
        await sendPasswordResetEmail(user.email, resetUrl);

        return NextResponse.json(
            { message: "If a user with this email exists, a password reset email has been sent." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Password reset request error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid request data", errors: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, newPassword } = resetPasswordSchema.parse(body);

        // Hash the token to compare with stored hash
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user with valid reset token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 12);

        // Update user's password and clear reset token fields
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json(
            { message: "Password has been reset successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Password reset error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid request data", errors: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}
