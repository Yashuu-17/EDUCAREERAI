import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // 1. Fetch user enrollments with course details
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            department: true,
            level: true,
            estimatedHours: true,
            modulesJson: true,
          },
        },
      },
      orderBy: { lastAccessed: 'desc' },
    });

    // 2. Fetch completed lessons count
    const completedLessonsCount = await prisma.lessonProgress.count({
      where: { userId: user.id, completed: true },
    });

    // 3. Fetch 30-day activity logs
    const activities = await prisma.dailyActivity.findMany({
      where: { userId: user.id },
      orderBy: { date: 'asc' },
      take: 60,
    });

    const totalMinutesSpent = activities.reduce((acc, curr) => acc + curr.minutesSpent, 0);
    const totalHoursSpent = (totalMinutesSpent / 60).toFixed(1);

    // 4. Fetch quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    const averageQuizScore =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / quizAttempts.length
          )
        : 85;

    // 5. Category time breakdown for Pie Chart
    const categoryDistribution = [
      { name: 'Programming Languages', value: 35, color: '#6366f1' },
      { name: 'AI & Data Domains', value: 30, color: '#06b6d4' },
      { name: 'B.Tech Core Curriculum', value: 20, color: '#a855f7' },
      { name: 'Mathematics', value: 10, color: '#f59e0b' },
      { name: 'Career & Soft Skills', value: 5, color: '#10b981' },
    ];

    // 6. Skill radar for Radar Chart
    const skillRadar = [
      { subject: 'DSA & Coding', score: 85, fullMark: 100 },
      { subject: 'AI & Machine Learning', score: 80, fullMark: 100 },
      { subject: 'Operating Systems & DBMS', score: 75, fullMark: 100 },
      { subject: 'Mathematics & Stats', score: 70, fullMark: 100 },
      { subject: 'Aptitude & Soft Skills', score: 82, fullMark: 100 },
      { subject: 'System Architecture', score: 68, fullMark: 100 },
    ];

    // 7. Gamified Badges
    const badges = [
      { id: 'streak-7', name: '7-Day Streak Master', icon: '🔥', unlocked: (user.streak || 1) >= 7, desc: 'Logged in and learned 7 days in a row' },
      { id: 'first-course', name: 'Curriculum Pioneer', icon: '🎓', unlocked: enrollments.length > 0, desc: 'Enrolled in first academic/career course' },
      { id: 'code-wizard', name: 'Python Prodigy', icon: '⚡', unlocked: completedLessonsCount >= 3, desc: 'Completed 3+ coding modules' },
      { id: 'quiz-ace', name: 'Quiz Top Scorer', icon: '🏆', unlocked: averageQuizScore >= 80, desc: 'Scored 80%+ on technical quizzes' },
      { id: 'ats-builder', name: 'Career Ready', icon: '📄', unlocked: true, desc: 'Built and verified ATS resume' },
    ];

    // 8. Weekly AI Study Plan recommendation
    const weeklyStudyPlan = [
      { day: 'Monday', task: 'Deep dive into Python Data Structures & Complexity ($O(1)$ vs $O(N)$)', duration: '45 mins', status: 'Completed' },
      { day: 'Tuesday', task: 'Linear Regression Cost Optimization & Gradient Descent derivation', duration: '50 mins', status: 'Completed' },
      { day: 'Wednesday', task: 'Practice 10 C++ STL / DSA questions on Trees & HashMaps', duration: '40 mins', status: 'Today' },
      { day: 'Thursday', task: 'B.Tech Core: Operating Systems Process Scheduling & Deadlocks', duration: '45 mins', status: 'Upcoming' },
      { day: 'Friday', task: 'Campus Placement Quantitative Aptitude test (Speed Math)', duration: '35 mins', status: 'Upcoming' },
      { day: 'Weekend', task: 'Build Mini-Project: Predictive Placement Analytics Pipeline', duration: '2 hours', status: 'Upcoming' },
    ];

    return NextResponse.json({
      user,
      summary: {
        totalEnrolled: enrollments.length,
        completedLessons: completedLessonsCount,
        totalHoursSpent,
        averageQuizScore,
        streak: user.streak || 1,
      },
      enrolledCourses: enrollments.map((e) => ({
        id: e.id,
        courseId: e.course.id,
        slug: e.course.slug,
        title: e.course.title,
        category: e.course.category,
        department: e.course.department,
        level: e.course.level,
        estimatedHours: e.course.estimatedHours,
        progressPercent: e.progressPercent,
        lastAccessed: e.lastAccessed,
      })),
      activityHistory: activities,
      categoryDistribution,
      skillRadar,
      recentQuizzes: quizAttempts,
      badges,
      weeklyStudyPlan,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data.' },
      { status: 500 }
    );
  }
}
