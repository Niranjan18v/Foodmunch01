const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const { protect, authorize } = require('../middleware/auth');


router.get('/', protect, async (req, res) => {
  try {
    let reservations;
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      reservations = await Reservation.find().populate('user').populate('table');
    } else {
      reservations = await Reservation.find({ user: req.user.id }).populate('user').populate('table');
    }
    
    const sorted = [...reservations].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.timeSlot}`);
      const dateB = new Date(`${b.date}T${b.timeSlot}`);
      return dateB - dateA; 
    });

    res.json({ success: true, reservations: sorted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.post('/', protect, async (req, res) => {
  try {
    const { date, timeSlot, guestsCount, specialRequests } = req.body;

    if (!date || !timeSlot || !guestsCount) {
      return res.status(400).json({ success: false, message: 'Please provide date, time slot, and guest count' });
    }


    const allTables = await Table.find({ status: 'available' });
    const activeReservations = await Reservation.find({ date, timeSlot, status: { $ne: 'cancelled' } });
    
    const bookedTableIds = activeReservations.map(res => {
      if (res.table && typeof res.table === 'object') return res.table._id;
      return res.table;
    }).filter(Boolean);

    const availableTables = allTables
      .filter(t => !bookedTableIds.includes(t._id) && t.capacity >= guestsCount)
      .sort((a, b) => a.capacity - b.capacity); 

    let assignedTableId = null;
    if (availableTables.length > 0) {
      assignedTableId = availableTables[0]._id;
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      table: assignedTableId,
      date,
      timeSlot,
      guestsCount,
      specialRequests: specialRequests || '',
      status: 'pending' 
    });

    const populated = await Reservation.findById(reservation._id);
    const result = await Reservation.find({ _id: reservation._id }).populate('user').populate('table');

    res.status(201).json({ 
      success: true, 
      reservation: result[0] || reservation,
      message: assignedTableId 
        ? 'Reservation submitted and table auto-assigned!' 
        : 'Reservation submitted. We will assign a table shortly.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id/status', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { status, tableId } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (tableId) updateData.table = tableId;

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    const populated = await Reservation.find({ _id: req.params.id }).populate('user').populate('table');

    res.json({ success: true, reservation: populated[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.user.id && req.user.role === 'customer') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this reservation' });
    }

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('user').populate('table');

    res.json({ success: true, reservation: updated, message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.json({ success: true, message: 'Reservation record deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
