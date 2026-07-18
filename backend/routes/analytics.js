const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');


router.get('/dashboard', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const totalReservations = await Reservation.countDocuments();
    const todayReservations = await Reservation.countDocuments({ date: todayStr });
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    const confirmedReservations = await Reservation.countDocuments({ status: 'confirmed' });
    const completedReservations = await Reservation.countDocuments({ status: 'completed' });
    const cancelledReservations = await Reservation.countDocuments({ status: 'cancelled' });

    const totalTables = await Table.countDocuments();
    const availableTables = await Table.countDocuments({ status: 'available' });

    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalMenuItems = await MenuItem.countDocuments();

    const reviews = await Review.find();
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

    const rawRecent = await Reservation.find().populate('user').populate('table');
    const recentReservations = [...rawRecent]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const reservations = await Reservation.find();
    const trendMap = {};
    reservations.forEach(r => {
      trendMap[r.date] = (trendMap[r.date] || 0) + 1;
    });

    const trendData = Object.keys(trendMap)
      .sort()
      .map(date => ({ date, count: trendMap[date] }))
      .slice(-7);

    res.json({
      success: true,
      stats: {
        totalReservations,
        todayReservations,
        pendingReservations,
        confirmedReservations,
        completedReservations,
        cancelledReservations,
        totalTables,
        availableTables,
        totalUsers,
        totalMenuItems,
        avgRating,
        reviewsCount: reviews.length
      },
      recentReservations,
      trendData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
