const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { prisma } = require('../config/db');
const { protect, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

function signToken(userId, email) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
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
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        college: college || 'Engineering College',
        department: department || 'Artificial Intelligence',
        yearSemester: yearSemester || '3rd Year / Semester 5 & 6',
        careerGoal: careerGoal || 'IT',
        skillLevel: skillLevel || 'Intermediate',
        preferredLanguage: preferredLanguage || 'English',
        streak: 1,
        lastActive: new Date(),
      },
    });

    const token = signToken(user.id, user.email);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        streak: user.streak,
      },
    });
  } catch (error) {
    console.error('Express register error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user.id, user.email);

    res.json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        yearSemester: user.yearSemester,
        careerGoal: user.careerGoal,
        skillLevel: user.skillLevel,
        streak: user.streak,
      },
    });
  } catch (error) {
    console.error('Express login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// GET /api/v1/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/v1/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, college, department, yearSemester, careerGoal, skillLevel, preferredLanguage } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(college !== undefined ? { college: college.trim() } : {}),
        ...(department ? { department } : {}),
        ...(yearSemester ? { yearSemester } : {}),
        ...(careerGoal ? { careerGoal } : {}),
        ...(skillLevel ? { skillLevel } : {}),
        ...(preferredLanguage ? { preferredLanguage } : {}),
      },
    });

    res.json({ message: 'Profile updated successfully!', user: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.json({ message: 'If account exists, instructions generated.', resetLink: null });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry: new Date(Date.now() + 3600000) },
    });

    res.json({
      message: 'Password reset link generated.',
      resetLink: `/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate reset link.' });
  }
});

module.exports = router;
