import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { slug } = params;
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Please login to enroll in this course.' },
        { status: 401 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    const enrollment = await prisma.courseEnrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      update: {
        lastAccessed: new Date(),
      },
      create: {
        userId: user.id,
        courseId: course.id,
        progressPercent: 0,
        enrolledAt: new Date(),
        lastAccessed: new Date(),
      },
    });

    return NextResponse.json({
      message: `Enrolled successfully in ${course.title}!`,
      enrollment,
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course.' },
      { status: 500 }
    );
  }
}
