const mongoose = require('mongoose');
const { getUseLocalJsonDB, JsonModel } = require('../config/db');

const TableSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['available', 'reserved', 'occupied'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

const MongoTable = mongoose.models.Table || mongoose.model('Table', TableSchema);
const JsonTable = new JsonModel('tables');

const TableModelWrapper = {
  find: (query) => getUseLocalJsonDB() ? JsonTable.find(query) : MongoTable.find(query),
  findOne: (query) => getUseLocalJsonDB() ? JsonTable.findOne(query) : MongoTable.findOne(query),
  findById: (id) => getUseLocalJsonDB() ? JsonTable.findById(id) : MongoTable.findById(id),
  create: (data) => getUseLocalJsonDB() ? JsonTable.create(data) : MongoTable.create(data),
  findByIdAndUpdate: (id, data, options) => getUseLocalJsonDB() ? JsonTable.findByIdAndUpdate(id, data, options) : MongoTable.findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getUseLocalJsonDB() ? JsonTable.findByIdAndDelete(id) : MongoTable.findByIdAndDelete(id),
  countDocuments: (query) => getUseLocalJsonDB() ? JsonTable.countDocuments(query) : MongoTable.countDocuments(query),
};

module.exports = TableModelWrapper;
