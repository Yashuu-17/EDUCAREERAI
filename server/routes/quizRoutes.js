const express = require('express');
const router = express.Router();
const { questionsData } = require('../../data/questionsData');

// GET /api/v1/quizzes - List quiz topics & summary
router.get('/', (req, res) => {
  try {
    const topicsMap = {};
    questionsData.forEach((q) => {
      topicsMap[q.topic] = (topicsMap[q.topic] || 0) + 1;
    });

    const topics = Object.entries(topicsMap).map(([name, count]) => ({
      name,
      count,
    }));

    res.json({
      status: 'success',
      totalQuestions: questionsData.length,
      topics,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz topics.' });
  }
});

// GET /api/v1/quizzes/questions - Get questions by topic/category or mock mode
router.get('/questions', (req, res) => {
  try {
    const { topic, category, mock } = req.query;
    let pool = [...questionsData];

    if (category && category !== 'ALL') {
      const catMatches = pool.filter((q) => q.category === category);
      if (catMatches.length > 0) pool = catMatches;
    }

    if (topic && topic !== 'ALL') {
      const qTopic = topic.toLowerCase().trim();
      let matches = pool.filter((q) => {
        const itemTopic = q.topic.toLowerCase();
        return itemTopic.includes(qTopic) || qTopic.includes(itemTopic);
      });

      if (matches.length === 0) {
        const tokens = qTopic.split(/[\s,&/\-]+/).filter((w) => w.length > 2);
        matches = pool.filter((q) => {
          const itemTopic = q.topic.toLowerCase();
          const itemQuestion = q.question.toLowerCase();
          return tokens.some((token) => itemTopic.includes(token) || itemQuestion.includes(token));
        });
      }

      if (matches.length > 0) {
        pool = matches;
      }
    }

    if (mock === 'true') {
      pool = pool.sort(() => 0.5 - Math.random()).slice(0, 10);
    }

    res.json({
      count: pool.length,
      questions: pool,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
});

module.exports = router;
