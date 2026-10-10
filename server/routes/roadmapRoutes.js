const express = require('express');
const router = express.Router();
const { roadmapsData } = require('../../data/roadmapsData');

// GET /api/v1/roadmaps - Get all roadmaps with optional category filter
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    let list = [...roadmapsData];

    if (category && category !== 'ALL') {
      list = list.filter((r) => r.category === category);
    }

    res.json({
      status: 'success',
      count: list.length,
      roadmaps: list,
    });
  } catch (error) {
    console.error('Express roadmaps error:', error);
    res.status(500).json({ error: 'Failed to fetch roadmaps.' });
  }
});

// GET /api/v1/roadmaps/:slug - Get single roadmap by slug
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const roadmap = roadmapsData.find((r) => r.slug === slug);

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    res.json({
      status: 'success',
      roadmap,
    });
  } catch (error) {
    console.error('Express roadmap slug error:', error);
    res.status(500).json({ error: 'Failed to fetch roadmap.' });
  }
});

module.exports = router;
