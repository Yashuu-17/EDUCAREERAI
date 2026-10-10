import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      college,
      department,
      yearSemester,
      careerGoal,
      skillLevel,
      preferredLanguage,
    } = body;

    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(college !== undefined ? { college: college.trim() } : {}),
        ...(department ? { department } : {}),
        ...(yearSemester ? { yearSemester } : {}),
        ...(careerGoal ? { careerGoal } : {}),
        ...(skillLevel ? { skillLevel } : {}),
        ...(preferredLanguage ? { preferredLanguage } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        department: true,
        yearSemester: true,
        careerGoal: true,
        skillLevel: true,
        preferredLanguage: true,
        role: true,
        streak: true,
        lastActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
