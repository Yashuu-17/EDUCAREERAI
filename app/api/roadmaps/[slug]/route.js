import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { roadmapsData } from '@/data/roadmapsData';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const user = await getAuthUser(request);

    const roadmap = roadmapsData.find((r) => r.slug === slug);
    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap not found.' }, { status: 404 });
    }

    let progressPercent = 0;
    let completedNodes = [];

    if (user) {
      const record = await prisma.roadmapProgress.findUnique({
        where: {
          userId_roadmapSlug: {
            userId: user.id,
            roadmapSlug: slug,
          },
        },
      });

      if (record) {
        progressPercent = record.progressPercent;
        completedNodes = JSON.parse(record.completedNodes || '[]');
      }
    }

    return NextResponse.json({
      roadmap: {
        ...roadmap,
        progressPercent,
        completedNodes,
      },
    });
  } catch (error) {
    console.error('Fetch single roadmap error:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmap.' }, { status: 500 });
  }
}
