import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ attempts: [] });
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const formatted = attempts.map((a) => ({
      ...a,
      weakTopics: JSON.parse(a.weakTopics || '[]'),
      wrongAnswers: JSON.parse(a.wrongAnswers || '[]'),
    }));

    return NextResponse.json({ attempts: formatted });
  } catch (error) {
    console.error('Fetch quiz history error:', error);
    return NextResponse.json({ attempts: [] });
  }
}
