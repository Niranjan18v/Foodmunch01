const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');


router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('user');
    
    const sorted = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, reviews: sorted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide both rating and comment' });
    }

    const review = await Review.create({
      user: req.user.id,
      rating,
      comment
    });

    const populated = await Review.find({ _id: review._id }).populate('user');

    res.status(201).json({ success: true, review: populated[0] || review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
