const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json({ success: true, tables });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { number, capacity, status } = req.body;

    const tableExists = await Table.findOne({ number });
    if (tableExists) {
      return res.status(400).json({ success: false, message: 'Table number already exists' });
    }

    const table = await Table.create({
      number,
      capacity,
      status: status || 'available'
    });

    res.status(201).json({ success: true, table });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.put('/:id', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { number, capacity, status } = req.body;

    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { number, capacity, status },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    res.json({ success: true, table });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    res.json({ success: true, message: 'Table deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
