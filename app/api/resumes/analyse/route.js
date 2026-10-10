import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const { resumeText, targetRole = 'Software Engineer', jobDescription = '' } = body;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide at least 50 characters of resume text to analyze.' },
        { status: 400 }
      );
    }

    const textLower = resumeText.toLowerCase();

    // 1. Check Standard Sections
    const requiredSections = [
      { name: 'Education', regex: /education|degree|b\.tech|bachelor/i },
      { name: 'Skills / Technical Skills', regex: /skills|technical skills|technologies/i },
      { name: 'Projects', regex: /projects|academic projects|capstone/i },
      { name: 'Experience / Internships', regex: /experience|internship|work/i },
      { name: 'Contact Info', regex: /email|phone|linkedin|github/i },
    ];

    const missingSections = [];
    let sectionScore = 0;
    requiredSections.forEach((sec) => {
      if (sec.regex.test(resumeText)) {
        sectionScore += 4; // 20 max
      } else {
        missingSections.push(sec.name);
      }
    });

    // 2. Keyword check based on Target Role
    const roleKeywordsMap = {
      'Software Developer': ['python', 'c++', 'javascript', 'git', 'sql', 'dsa', 'api', 'algorithms', 'database'],
      'Machine Learning': ['python', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy', 'regression', 'eda', 'model'],
      'Full Stack': ['react', 'next.js', 'node.js', 'typescript', 'mongodb', 'postgresql', 'rest', 'css', 'html'],
      'Mechanical': ['solidworks', 'cad', 'ansys', 'thermodynamics', 'gd&t', 'fea', 'manufacturing', 'chassis'],
      'ECE': ['verilog', 'vlsi', 'embedded', 'microcontroller', 'fpga', 'arm', 'i2c', 'uart', 'cmos'],
      'Default': ['communication', 'teamwork', 'project', 'git', 'analysis', 'problem solving', 'python', 'sql'],
    };

    const targetList =
      roleKeywordsMap[targetRole] || roleKeywordsMap['Software Developer'] || roleKeywordsMap['Default'];

    const missingKeywords = [];
    let keywordHits = 0;
    targetList.forEach((kw) => {
      if (textLower.includes(kw.toLowerCase())) {
        keywordHits += 1;
      } else {
        missingKeywords.push(kw);
      }
    });

    const keywordScore = Math.min(25, Math.round((keywordHits / targetList.length) * 25));

    // 3. Action Verbs Check
    const actionVerbs = [
      'developed', 'built', 'implemented', 'designed', 'optimized',
      'spearheaded', 'created', 'engineered', 'deployed', 'automated',
      'improved', 'solved', 'architected', 'integrated'
    ];
    let actionHits = 0;
    actionVerbs.forEach((vb) => {
      if (textLower.includes(vb)) actionHits += 1;
    });
    const actionScore = Math.min(20, actionHits * 3.5);

    // 4. Measurable Metrics (numbers, %, metrics)
    const metricsMatches = resumeText.match(/\d+(\.\d+)?%|\$\d+|\d+\+?\s?(users|clients|seconds|ms|queries|records|stars)/gi) || [];
    const metricScore = Math.min(15, metricsMatches.length * 5);

    // 5. Formatting & Contact
    let formattingScore = 20;
    if (resumeText.length > 5000) formattingScore -= 5; // too long
    if (resumeText.length < 300) formattingScore -= 8; // too short

    // Overall ATS Score (0 - 100)
    const overallScore = Math.min(
      98,
      Math.max(35, Math.round(sectionScore + keywordScore + actionScore + metricScore + formattingScore))
    );

    // Weak bullet points identification
    const weakBullets = [
      {
        weak: 'Worked on a machine learning project in college.',
        improved: 'Engineered an end-to-end placement prediction ML model with Scikit-Learn, achieving 89% accuracy across 1,200 student records (Google XYZ formula).',
      },
      {
        weak: 'Responsible for making backend API routes.',
        improved: 'Architected 12 RESTful API endpoints using Node.js & Prisma SQLite, reducing response latency by 24% via database indexing.',
      },
    ];

    // Skill Gap Links
    const skillGaps = missingKeywords.slice(0, 4).map((kw) => ({
      skill: kw,
      courseSlug: kw.toLowerCase().includes('python')
        ? 'python-mastery'
        : kw.toLowerCase().includes('learn') || kw.toLowerCase().includes('model')
        ? 'machine-learning-engineering'
        : 'javascript-typescript',
      courseTitle: `Master ${kw.toUpperCase()} on EduCareer AI Catalog`,
    }));

    // Save analysis record if authenticated
    let savedId = null;
    if (user) {
      const record = await prisma.resumeAnalysis.create({
        data: {
          userId: user.id,
          fileName: 'Resume_Analysis_' + targetRole.replace(/\s+/g, '_'),
          targetRole,
          atsScore: overallScore,
          breakdownJson: JSON.stringify({
            sections: sectionScore,
            keywords: keywordScore,
            actionVerbs: actionScore,
            measurableImpact: metricScore,
            formatting: formattingScore,
          }),
          missingSections: JSON.stringify(missingSections),
          missingKeywords: JSON.stringify(missingKeywords),
          weakBullets: JSON.stringify(weakBullets),
          skillGaps: JSON.stringify(skillGaps),
          suggestions: JSON.stringify([
            'Add measurable metrics (e.g. percentages, user counts) to each bullet point.',
            'Include relevant GitHub and LinkedIn project demo links.',
            'Incorporate missing target role keywords into your technical skills summary.',
          ]),
        },
      });
      savedId = record.id;
    }

    return NextResponse.json({
      overallScore,
      scoreBreakdown: {
        sections: sectionScore,
        keywords: keywordScore,
        actionVerbs: actionScore,
        measurableImpact: metricScore,
        formatting: formattingScore,
      },
      missingSections,
      missingKeywords,
      weakBullets,
      skillGaps,
      suggestions: [
        'Add measurable metrics (percentages, speedups) using the Google XYZ formula.',
        'Incorporate target keywords into your technical skills summary.',
        'Ensure direct links to GitHub repositories are included.',
      ],
      analysisId: savedId,
    });
  } catch (error) {
    console.error('Resume analyser error:', error);
    return NextResponse.json({ error: 'Failed to analyze resume.' }, { status: 500 });
  }
}
