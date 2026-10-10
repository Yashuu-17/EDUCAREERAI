import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_ai_learning_token_2026_xyz';
const TOKEN_NAME = 'auth_token';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function getAuthUser(request) {
  try {
    let token = null;

    // 1. Check Bearer Authorization header
    if (request && request.headers) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // 2. Check cookies if token not in header
    if (!token) {
      const cookieStore = cookies();
      const cookie = cookieStore.get(TOKEN_NAME);
      if (cookie) {
        token = cookie.value;
      }
    }

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

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

    return user;
  } catch (error) {
    console.error('getAuthUser error:', error);
    return null;
  }
}

export { TOKEN_NAME };
