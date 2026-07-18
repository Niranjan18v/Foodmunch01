const mongoose = require('mongoose');
const { getUseLocalJsonDB, JsonModel } = require('../config/db');

const ReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' }, 
  date: { type: String, required: true },
  timeSlot: { type: String, required: true }, 
  guestsCount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const MongoReservation = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
const JsonReservation = new JsonModel('reservations');

const ReservationModelWrapper = {
  find: (query) => getUseLocalJsonDB() ? JsonReservation.find(query) : MongoReservation.find(query),
  findOne: (query) => getUseLocalJsonDB() ? JsonReservation.findOne(query) : MongoReservation.findOne(query),
  findById: (id) => getUseLocalJsonDB() ? JsonReservation.findById(id) : MongoReservation.findById(id),
  create: (data) => getUseLocalJsonDB() ? JsonReservation.create(data) : MongoReservation.create(data),
  findByIdAndUpdate: (id, data, options) => getUseLocalJsonDB() ? JsonReservation.findByIdAndUpdate(id, data, options) : MongoReservation.findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getUseLocalJsonDB() ? JsonReservation.findByIdAndDelete(id) : MongoReservation.findByIdAndDelete(id),
  countDocuments: (query) => getUseLocalJsonDB() ? JsonReservation.countDocuments(query) : MongoReservation.countDocuments(query),
};

module.exports = ReservationModelWrapper;
