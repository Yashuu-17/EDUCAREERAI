import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken, TOKEN_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      college,
      department,
      yearSemester,
      careerGoal,
      skillLevel,
      preferredLanguage,
    } = body;

    // Validate inputs
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please login instead.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in SQLite database
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        college: college ? college.trim() : 'B.Tech University',
        department: department || 'CSE',
        yearSemester: yearSemester || '3rd Year / 5th Sem',
        careerGoal: careerGoal || 'IT',
        skillLevel: skillLevel || 'Beginner',
        preferredLanguage: preferredLanguage || 'English',
        streak: 1,
        lastActive: new Date(),
      },
    });

    // Generate JWT
    const token = signToken({ userId: user.id, email: user.email });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      college: user.college,
      department: user.department,
      yearSemester: user.yearSemester,
      careerGoal: user.careerGoal,
      skillLevel: user.skillLevel,
      preferredLanguage: user.preferredLanguage,
      role: user.role,
      streak: user.streak,
      lastActive: user.lastActive,
      createdAt: user.createdAt,
    };

    const response = NextResponse.json(
      {
        message: 'Account created successfully! Welcome aboard.',
        user: safeUser,
        token,
      },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
