import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, signToken, TOKEN_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // Calculate streak update: check if last active was yesterday vs today
    const now = new Date();
    const lastActive = new Date(user.lastActive);
    const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
    let newStreak = user.streak || 1;

    if (diffDays === 1) {
      newStreak += 1; // Consecutive day!
    } else if (diffDays > 1) {
      newStreak = 1; // Reset streak if missed a day
    }

    // Update user's lastActive and streak
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActive: now,
        streak: newStreak,
      },
    });

    // Generate JWT
    const token = signToken({ userId: updatedUser.id, email: updatedUser.email });

    const safeUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      college: updatedUser.college,
      department: updatedUser.department,
      yearSemester: updatedUser.yearSemester,
      careerGoal: updatedUser.careerGoal,
      skillLevel: updatedUser.skillLevel,
      preferredLanguage: updatedUser.preferredLanguage,
      role: updatedUser.role,
      streak: updatedUser.streak,
      lastActive: updatedUser.lastActive,
      createdAt: updatedUser.createdAt,
    };

    const response = NextResponse.json(
      {
        message: 'Login successful! Welcome back.',
        user: safeUser,
        token,
      },
      { status: 200 }
    );

    response.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
