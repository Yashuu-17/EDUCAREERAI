const express = require('express');
const router = express.Router();
const prisma = require('../config/db').prisma;

// POST /api/v1/resumes/analyse - Benchmark resume text against keywords
router.post('/analyse', (req, res) => {
  try {
    const { resumeText = '', targetRole = 'Software Developer' } = req.body;
    const lower = resumeText.toLowerCase();

    const roleKeywords = {
      'Software Developer': ['python', 'c++', 'javascript', 'react', 'node', 'sql', 'git', 'data structures', 'algorithms', 'docker'],
      'Machine Learning': ['python', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy', 'machine learning', 'deep learning', 'nlp', 'transformers'],
      'Full Stack': ['javascript', 'typescript', 'react', 'next.js', 'node.js', 'mongodb', 'postgresql', 'rest api', 'tailwind', 'docker'],
      'Mechanical': ['solidworks', 'autocad', 'ansys', 'thermodynamics', 'gd&t', 'fea', 'cad', 'manufacturing', 'fluid mechanics', 'matlab'],
      'ECE': ['verilog', 'vhdl', 'vlsi', 'matlab', 'embedded systems', 'microcontroller', 'fpga', 'pcb', 'c', 'cadence'],
    };

    const targetList = roleKeywords[targetRole] || roleKeywords['Software Developer'];
    const matchedKeywords = targetList.filter((k) => lower.includes(k));
    const missingKeywords = targetList.filter((k) => !lower.includes(k));

    const keywordPercent = Math.round((matchedKeywords.length / targetList.length) * 50);

    let formatScore = 20;
    if (resumeText.length > 250) formatScore += 10;
    if (lower.includes('project') || lower.includes('education')) formatScore += 10;
    if (lower.includes('phone') || lower.includes('email')) formatScore += 10;

    const overallScore = Math.min(100, keywordPercent + formatScore);

    res.json({
      status: 'success',
      overallScore,
      matchedKeywords,
      missingKeywords,
      targetRole,
      summary: overallScore >= 75
        ? 'Strong candidate profile with high keyword density.'
        : 'Good foundation. Add the missing technical competencies to pass ATS filters.',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyse resume.' });
  }
});

module.exports = router;
