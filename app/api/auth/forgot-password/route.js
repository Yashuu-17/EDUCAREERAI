import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Return a safe message to prevent email enumeration, but give test guidance
      return NextResponse.json({
        message: 'If an account exists with this email, password reset instructions have been generated.',
        resetLink: null,
      });
    }

    // Generate token valid for 1 hour
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetLink = `/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    return NextResponse.json({
      message: 'Password reset instructions have been generated.',
      resetToken,
      resetLink,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process forgot password request.' },
      { status: 500 }
    );
  }
}
