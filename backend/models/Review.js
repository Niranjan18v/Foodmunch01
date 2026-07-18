const mongoose = require('mongoose');
const { getUseLocalJsonDB, JsonModel } = require('../config/db');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MongoReview = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
const JsonReview = new JsonModel('reviews');

const ReviewModelWrapper = {
  find: (query) => getUseLocalJsonDB() ? JsonReview.find(query) : MongoReview.find(query),
  findOne: (query) => getUseLocalJsonDB() ? JsonReview.findOne(query) : MongoReview.findOne(query),
  findById: (id) => getUseLocalJsonDB() ? JsonReview.findById(id) : MongoReview.findById(id),
  create: (data) => getUseLocalJsonDB() ? JsonReview.create(data) : MongoReview.create(data),
  findByIdAndUpdate: (id, data, options) => getUseLocalJsonDB() ? JsonReview.findByIdAndUpdate(id, data, options) : MongoReview.findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getUseLocalJsonDB() ? JsonReview.findByIdAndDelete(id) : MongoReview.findByIdAndDelete(id),
  countDocuments: (query) => getUseLocalJsonDB() ? JsonReview.countDocuments(query) : MongoReview.countDocuments(query),
};

module.exports = ReviewModelWrapper;
