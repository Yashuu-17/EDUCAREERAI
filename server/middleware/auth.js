const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_ai_learning_token_2026_xyz';

async function protect(req, res, next) {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized. Please login to continue.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    if (!user) {
      return res.status(401).json({ error: 'User associated with token no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

module.exports = { protect, JWT_SECRET };
