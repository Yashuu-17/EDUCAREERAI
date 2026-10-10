import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const department = searchParams.get('department');
    const level = searchParams.get('level');
    const language = searchParams.get('language');
    const search = searchParams.get('search');

    const where = {};

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (department && department !== 'ALL') {
      where.department = { contains: department };
    }

    if (level && level !== 'ALL') {
      where.level = level;
    }

    if (language && language !== 'ALL') {
      where.language = { contains: language };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { department: { contains: search } },
        { language: { contains: search } },
        { domain: { contains: search } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // If user is authenticated, check which courses they are enrolled in
    let enrolledCourseIds = new Set();
    let enrollmentProgressMap = {};

    if (user) {
      const enrollments = await prisma.courseEnrollment.findMany({
        where: { userId: user.id },
        select: { courseId: true, progressPercent: true },
      });
      enrollments.forEach((e) => {
        enrolledCourseIds.add(e.courseId);
        enrollmentProgressMap[e.courseId] = e.progressPercent;
      });
    }

    const formattedCourses = courses.map((c) => ({
      ...c,
      isEnrolled: enrolledCourseIds.has(c.id),
      progressPercent: enrollmentProgressMap[c.id] || 0,
      modules: JSON.parse(c.modulesJson || '[]'),
    }));

    return NextResponse.json({ courses: formattedCourses });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses.' },
      { status: 500 }
    );
  }
}
