import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { roadmapsData } from '@/data/roadmapsData';

export async function POST(request, { params }) {
  try {
    const { slug } = params;
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const roadmap = roadmapsData.find((r) => r.slug === slug);
    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap not found.' }, { status: 404 });
    }

    const { nodeId, completed } = await request.json();

    // Fetch existing progress
    const existing = await prisma.roadmapProgress.findUnique({
      where: {
        userId_roadmapSlug: {
          userId: user.id,
          roadmapSlug: slug,
        },
      },
    });

    let completedList = existing ? JSON.parse(existing.completedNodes || '[]') : [];

    if (completed) {
      if (!completedList.includes(nodeId)) completedList.push(nodeId);
    } else {
      completedList = completedList.filter((id) => id !== nodeId);
    }

    const totalNodesCount = roadmap.nodes.length;
    const newProgressPercent =
      totalNodesCount > 0
        ? Math.round((completedList.length / totalNodesCount) * 100)
        : 0;

    const updated = await prisma.roadmapProgress.upsert({
      where: {
        userId_roadmapSlug: {
          userId: user.id,
          roadmapSlug: slug,
        },
      },
      update: {
        completedNodes: JSON.stringify(completedList),
        progressPercent: newProgressPercent,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        roadmapSlug: slug,
        completedNodes: JSON.stringify(completedList),
        progressPercent: newProgressPercent,
      },
    });

    return NextResponse.json({
      message: 'Roadmap step updated!',
      completedNodes: completedList,
      progressPercent: newProgressPercent,
    });
  } catch (error) {
    console.error('Update roadmap progress error:', error);
    return NextResponse.json({ error: 'Failed to update roadmap progress.' }, { status: 500 });
  }
}
