const express = require('express');
const { prisma } = require('../config/db');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/courses (with filter by category, department, level, search)
router.get('/', async (req, res) => {
  try {
    const { category, department, level, search } = req.query;
    const where = {};

    if (category && category !== 'ALL') where.category = category;
    if (department && department !== 'ALL') where.department = { contains: department };
    if (level && level !== 'ALL') where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { department: { contains: search } },
        { language: { contains: search } },
      ];
    }

    const courses = await prisma.course.findMany({ where, orderBy: { createdAt: 'desc' } });

    res.json({
      count: courses.length,
      courses: courses.map((c) => ({
        ...c,
        modules: JSON.parse(c.modulesJson || '[]'),
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses.' });
  }
});

// GET /api/v1/courses/:slug
router.get('/:slug', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: req.params.slug },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    res.json({
      course: {
        ...course,
        modules: JSON.parse(course.modulesJson || '[]'),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course details.' });
  }
});

// POST /api/v1/courses/:slug/enroll (Protected)
router.post('/:slug/enroll', protect, async (req, res) => {
  try {
    const course = await prisma.course.findUnique({ where: { slug: req.params.slug } });
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const enrollment = await prisma.courseEnrollment.upsert({
      where: {
        userId_courseId: { userId: req.user.id, courseId: course.id },
      },
      update: { lastAccessed: new Date() },
      create: {
        userId: req.user.id,
        courseId: course.id,
        progressPercent: 0,
      },
    });

    res.json({ message: 'Enrolled successfully!', enrollment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll in course.' });
  }
});

// POST /api/v1/courses/:slug/lessons/:lessonId (Protected)
router.post('/:slug/lessons/:lessonId', protect, async (req, res) => {
  try {
    const { completed, isWatched, durationMinutes = 30 } = req.body;
    const course = await prisma.course.findUnique({ where: { slug: req.params.slug } });
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId: req.user.id,
          courseId: course.id,
          lessonId: req.params.lessonId,
        },
      },
      update: {
        ...(completed !== undefined ? { completed } : {}),
        ...(isWatched !== undefined ? { isWatched } : {}),
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: req.user.id,
        courseId: course.id,
        lessonId: req.params.lessonId,
        completed: completed || false,
        isWatched: isWatched || false,
        completedAt: completed ? new Date() : null,
      },
    });

    res.json({ message: 'Lesson progress updated!', progress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson progress.' });
  }
});

module.exports = router;
