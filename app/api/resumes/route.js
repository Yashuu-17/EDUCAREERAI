import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ resumes: [] });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    });

    const parsed = resumes.map((r) => ({
      ...r,
      resumeData: JSON.parse(r.resumeData || '{}'),
    }));

    return NextResponse.json({ resumes: parsed });
  } catch (error) {
    console.error('Fetch resumes error:', error);
    return NextResponse.json({ resumes: [] });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { title, targetRole, templateId, resumeData } = await request.json();

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: title || 'Engineering Fresher Resume',
        targetRole: targetRole || 'Software Engineer',
        templateId: templateId || 'modern-ats',
        resumeData: JSON.stringify(resumeData || {}),
      },
    });

    return NextResponse.json({
      message: 'Resume saved successfully!',
      resume,
    });
  } catch (error) {
    console.error('Save resume error:', error);
    return NextResponse.json({ error: 'Failed to save resume.' }, { status: 500 });
  }
}
