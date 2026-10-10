import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { roadmapsData } from '@/data/roadmapsData';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let userProgressMap = {};

    if (user) {
      const progressRecords = await prisma.roadmapProgress.findMany({
        where: { userId: user.id },
      });
      progressRecords.forEach((r) => {
        userProgressMap[r.roadmapSlug] = {
          progressPercent: r.progressPercent,
          completedNodes: JSON.parse(r.completedNodes || '[]'),
        };
      });
    }

    let filtered = roadmapsData;
    if (category && category !== 'ALL') {
      filtered = filtered.filter((r) => r.category === category);
    }

    const roadmaps = filtered.map((r) => {
      const prog = userProgressMap[r.slug];
      return {
        ...r,
        progressPercent: prog ? prog.progressPercent : 0,
        completedNodes: prog ? prog.completedNodes : [],
      };
    });

    return NextResponse.json({ roadmaps });
  } catch (error) {
    console.error('Fetch roadmaps error:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmaps.' }, { status: 500 });
  }
}
