const mongoose = require('mongoose');
const { getUseLocalJsonDB, JsonModel } = require('../config/db');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);
const JsonUser = new JsonModel('users');

const UserModelWrapper = {
  find: (query) => getUseLocalJsonDB() ? JsonUser.find(query) : MongoUser.find(query),
  findOne: (query) => getUseLocalJsonDB() ? JsonUser.findOne(query) : MongoUser.findOne(query),
  findById: (id) => getUseLocalJsonDB() ? JsonUser.findById(id) : MongoUser.findById(id),
  create: (data) => getUseLocalJsonDB() ? JsonUser.create(data) : MongoUser.create(data),
  findByIdAndUpdate: (id, data, options) => getUseLocalJsonDB() ? JsonUser.findByIdAndUpdate(id, data, options) : MongoUser.findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getUseLocalJsonDB() ? JsonUser.findByIdAndDelete(id) : MongoUser.findByIdAndDelete(id),
  countDocuments: (query) => getUseLocalJsonDB() ? JsonUser.countDocuments(query) : MongoUser.countDocuments(query),
};

module.exports = UserModelWrapper;
