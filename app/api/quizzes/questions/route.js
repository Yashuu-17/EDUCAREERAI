import { NextResponse } from 'next/server';
import { questionsData } from '@/data/questionsData';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const category = searchParams.get('category');
    const isMock = searchParams.get('mock') === 'true';

    let pool = [...questionsData];

    if (category && category !== 'ALL') {
      const catMatches = pool.filter((q) => q.category === category);
      if (catMatches.length > 0) {
        pool = catMatches;
      }
    }

    if (topic && topic !== 'ALL') {
      const qTopic = topic.toLowerCase().trim();

      // 1. Exact or bidirectional substring match
      let matches = pool.filter((q) => {
        const itemTopic = q.topic.toLowerCase();
        return itemTopic.includes(qTopic) || qTopic.includes(itemTopic);
      });

      // 2. Tokenized word overlap match
      if (matches.length === 0) {
        const tokens = qTopic.split(/[\s,&/\-]+/).filter((w) => w.length > 2);
        matches = pool.filter((q) => {
          const itemTopic = q.topic.toLowerCase();
          const itemQuestion = q.question.toLowerCase();
          return tokens.some((token) => itemTopic.includes(token) || itemQuestion.includes(token));
        });
      }

      // 3. Fallback: if matches found, use them; otherwise use pool so student always gets questions
      if (matches.length > 0) {
        pool = matches;
      }
    }

    if (isMock) {
      // Shuffle and pick 10 questions for Mock Interview Mode
      pool = pool.sort(() => 0.5 - Math.random()).slice(0, 10);
    }

    return NextResponse.json({
      count: pool.length,
      questions: pool,
    });
  } catch (error) {
    console.error('Fetch questions error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions.' }, { status: 500 });
  }
}
