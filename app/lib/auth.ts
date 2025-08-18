/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt, { SignOptions } from 'jsonwebtoken'
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions, getServerSession } from 'next-auth';
import prisma from './prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/signin',
        newUser: '/signup',
        verifyRequest: '/auth/verify-request',
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Invalid credentials');
                    }

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                        },
                    });

                    if (!user || !user.passwordHash) {
                        throw new Error('Invalid credentials');
                    }

                    if (!user.emailVerified) {
                        throw new Error('Please verify your email before signing in');
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.passwordHash
                    );

                    if (!isCorrectPassword) {
                        throw new Error('Invalid credentials');
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        role: user.role,
                    };
                } catch (error: any) {
                    console.error('Error during authorization:', error);
                    throw new Error(error.message || 'Authorization failed');
                } finally {
                    await prisma.$disconnect();
                }

            },
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.username = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
            }

            return session;
        },
        async jwt({ token, user }) {
            try {

                const dbUser = await prisma.user.findFirst({
                    where: {
                        email: token.email!,
                    },
                });

                if (!dbUser) {
                    if (user) {
                        token.id = user?.id;
                    }
                    return token;
                }

                return {
                    id: dbUser.id,
                    name: dbUser.username,
                    email: dbUser.email,
                    role: dbUser.role,
                    phone: dbUser.phone,
                    emailVerified: dbUser.emailVerified,
                };
            } catch (error: any) {
                console.error('Error in JWT callback:', error);
                throw new Error(error.message || 'JWT callback failed');
            }
            finally {
                await prisma.$disconnect();
            }
        },
    },
};

export const getAuthSession = () => getServerSession(authOptions);

export const generateToken = async (payload: object, expiresIn: jwt.SignOptions['expiresIn'] = '7d') => {
    const options: SignOptions = { expiresIn }
    return jwt.sign(payload, JWT_SECRET, options)
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error: any) {
        throw new Error(`Token verification failed: ${error.message}`)
    }
}

export const hashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
};

export const validatePassword = async (
    inputPassword: string,
    hashedPassword: string
) => {
    const isValid = await bcrypt.compare(inputPassword, hashedPassword);
    return isValid;
};

export const isAdmin = async (userId: string) => {
    try {

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        return user?.role === 'ADMIN';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
};

// Auth middleware helper
export const requireAuth = async () => {
    const session = await getAuthSession();

    if (!session?.user) {
        return false
    }

    return session.user;
};

// Admin middleware helper
export const requireAdmin = async () => {
    const session = await getAuthSession();
    const isUserAdmin = await isAdmin(session!.user.id);

    if (!isUserAdmin) {
        return false
    }

    return session!.user;
};

// Auth middleware helper with redirect
export const requireAuthWithRedirect = async () => {
    const session = await getAuthSession();

    if (!session?.user) {
        throw new Error('Unauthorized - Please sign in');
    }

    return session.user;
};

// Role-based auth middleware
export const requireRole = async (requiredRole: 'ADMIN' | 'VIP' | 'USER') => {
    const session = await getAuthSession();

    if (!session?.user) {
        throw new Error('Unauthorized - Please sign in');
    }

    if (session.user.role !== requiredRole &&
        !(requiredRole === 'USER' && ['ADMIN', 'VIP'].includes(session.user.role)) &&
        !(requiredRole === 'VIP' && session.user.role === 'ADMIN')) {
        throw new Error(`Unauthorized - Required role: ${requiredRole}`);
    }

    return session.user;
};

// Helper to get safe user data (excludes sensitive info)
export const getSafeUser = (user: any) => {
    if (!user) return null;

    // Exclude sensitive fields
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};

// Session validation helper
export const validateSession = async () => {
    const session = await getAuthSession();
    return {
        isAuthenticated: !!session?.user,
        user: session?.user || null,
    };
};
