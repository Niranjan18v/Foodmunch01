const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect, authorize } = require('../middleware/auth');


router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json({ success: true, menuItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, price, category, image, availability } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      image: image || '',
      availability: availability !== undefined ? availability : true
    });

    res.status(201).json({ success: true, menuItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, price, category, image, availability } = req.body;

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, image, availability },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, menuItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
