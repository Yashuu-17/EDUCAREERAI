import { NextResponse } from 'next/server';
import { questionsData } from '@/data/questionsData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const topicsMap = {};
    questionsData.forEach((q) => {
      topicsMap[q.topic] = (topicsMap[q.topic] || 0) + 1;
    });

    const topics = Object.entries(topicsMap).map(([name, count]) => ({
      name,
      count,
    }));

    return NextResponse.json({
      status: 'success',
      totalQuestions: questionsData.length,
      topics,
      categories: ['PROGRAMMING', 'AI_DATA', 'BTECH_DEPARTMENTS', 'CAREER_SOFT_SKILLS'],
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch quiz topics' }, { status: 500 });
  }
}
