import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { slug, lessonId } = params;
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { completed, isWatched, durationMinutes = 30 } = await request.json();

    const course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    // Upsert lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId: user.id,
          courseId: course.id,
          lessonId,
        },
      },
      update: {
        ...(completed !== undefined ? { completed } : {}),
        ...(isWatched !== undefined ? { isWatched } : {}),
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: user.id,
        courseId: course.id,
        lessonId,
        completed: completed || false,
        isWatched: isWatched || false,
        completedAt: completed ? new Date() : null,
      },
    });

    // Count total lessons in course
    const modules = JSON.parse(course.modulesJson || '[]');
    let totalLessonsCount = 0;
    modules.forEach((m) => {
      totalLessonsCount += (m.lessons || []).length;
    });

    // Count completed lessons for this course
    const completedCount = await prisma.lessonProgress.count({
      where: {
        userId: user.id,
        courseId: course.id,
        completed: true,
      },
    });

    const newProgressPercent =
      totalLessonsCount > 0
        ? Math.round((completedCount / totalLessonsCount) * 100)
        : 0;

    // Update enrollment progress
    await prisma.courseEnrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      update: {
        progressPercent: newProgressPercent,
        lastAccessed: new Date(),
      },
      create: {
        userId: user.id,
        courseId: course.id,
        progressPercent: newProgressPercent,
        enrolledAt: new Date(),
        lastAccessed: new Date(),
      },
    });

    // Update today's DailyActivity record
    const todayStr = new Date().toISOString().split('T')[0];
    await prisma.dailyActivity.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: todayStr,
        },
      },
      update: {
        minutesSpent: { increment: durationMinutes },
        lessonsCompleted: completed ? { increment: 1 } : undefined,
      },
      create: {
        userId: user.id,
        date: todayStr,
        minutesSpent: durationMinutes,
        lessonsCompleted: completed ? 1 : 0,
      },
    });

    return NextResponse.json({
      message: 'Progress updated immediately!',
      progress,
      progressPercent: newProgressPercent,
    });
  } catch (error) {
    console.error('Update lesson progress error:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson progress.' },
      { status: 500 }
    );
  }
}
