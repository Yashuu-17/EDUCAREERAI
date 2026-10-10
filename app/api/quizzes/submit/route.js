import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { questionsData } from '@/data/questionsData';

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const { topic, category, answers } = body; // answers is an object: { [questionId]: selectedOption }

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'No answers provided.' }, { status: 400 });
    }

    let score = 0;
    const totalQuestions = Object.keys(answers).length;
    const wrongAnswers = [];
    const weakTopicsSet = new Set();

    for (const [qId, selectedOption] of Object.entries(answers)) {
      const q = questionsData.find((item) => item.id === qId);
      if (q) {
        if (q.correctAnswer === selectedOption) {
          score += 1;
        } else {
          wrongAnswers.push({
            questionId: q.id,
            question: q.question,
            yourAnswer: selectedOption,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          });
          weakTopicsSet.add(q.topic);
        }
      }
    }

    const percentage = Math.round((score / totalQuestions) * 100);
    const weakTopics = Array.from(weakTopicsSet);

    // Save in database if user is logged in
    let attemptRecord = null;
    if (user) {
      attemptRecord = await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          category: category || 'GENERAL',
          topic: topic || 'Mock Interview',
          score,
          totalQuestions,
          percentage,
          weakTopics: JSON.stringify(weakTopics),
          wrongAnswers: JSON.stringify(wrongAnswers),
        },
      });

      // Update DailyActivity
      const todayStr = new Date().toISOString().split('T')[0];
      await prisma.dailyActivity.upsert({
        where: { userId_date: { userId: user.id, date: todayStr } },
        update: {
          quizzesTaken: { increment: 1 },
          score: percentage,
        },
        create: {
          userId: user.id,
          date: todayStr,
          minutesSpent: 15,
          lessonsCompleted: 0,
          quizzesTaken: 1,
          score: percentage,
        },
      });
    }

    return NextResponse.json({
      message: 'Quiz evaluated successfully!',
      score,
      totalQuestions,
      percentage,
      weakTopics,
      wrongAnswers,
      attemptId: attemptRecord?.id,
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json({ error: 'Failed to evaluate quiz.' }, { status: 500 });
  }
}
