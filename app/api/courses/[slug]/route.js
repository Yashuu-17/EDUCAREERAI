import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const user = await getAuthUser(request);

    const course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    let isEnrolled = false;
    let progressPercent = 0;
    let completedLessonIds = [];
    let watchedLessonIds = [];

    if (user) {
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      });

      if (enrollment) {
        isEnrolled = true;
        progressPercent = enrollment.progressPercent;
      }

      const progressRecords = await prisma.lessonProgress.findMany({
        where: {
          userId: user.id,
          courseId: course.id,
        },
      });

      progressRecords.forEach((r) => {
        if (r.completed) completedLessonIds.push(r.lessonId);
        if (r.isWatched) watchedLessonIds.push(r.lessonId);
      });
    }

    // Also fetch relevant YouTube channels for this course domain
    const recommendedChannels = await prisma.yOU_TUBE_RESOURCE?.findMany?.({
      take: 4,
    }) || [];

    const modules = JSON.parse(course.modulesJson || '[]');

    return NextResponse.json({
      course: {
        ...course,
        modules,
        isEnrolled,
        progressPercent,
        completedLessonIds,
        watchedLessonIds,
      },
    });
  } catch (error) {
    console.error('Fetch single course error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course details.' },
      { status: 500 }
    );
  }
}
