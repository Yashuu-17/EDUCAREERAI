const express = require('express');
const { prisma } = require('../config/db');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/dashboard
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { lastAccessed: 'desc' },
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: { userId, completed: true },
    });

    const activities = await prisma.dailyActivity.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      take: 60,
    });

    const totalMinutes = activities.reduce((acc, curr) => acc + curr.minutesSpent, 0);

    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const averageQuizScore =
      quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / quizAttempts.length)
        : 85;

    res.json({
      user: req.user,
      summary: {
        totalEnrolled: enrollments.length,
        completedLessons,
        totalHoursSpent: (totalMinutes / 60).toFixed(1),
        averageQuizScore,
        streak: req.user.streak,
      },
      enrolledCourses: enrollments.map((e) => ({
        id: e.id,
        courseId: e.course.id,
        title: e.course.title,
        slug: e.course.slug,
        department: e.course.department,
        level: e.course.level,
        progressPercent: e.progressPercent,
      })),
      activityHistory: activities,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard metrics.' });
  }
});

module.exports = router;
