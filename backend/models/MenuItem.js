const mongoose = require('mongoose');
const { getUseLocalJsonDB, JsonModel } = require('../config/db');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true 
  },
  image: { type: String }, 
  availability: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const MongoMenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
const JsonMenuItem = new JsonModel('menuitems');

const MenuItemModelWrapper = {
  find: (query) => getUseLocalJsonDB() ? JsonMenuItem.find(query) : MongoMenuItem.find(query),
  findOne: (query) => getUseLocalJsonDB() ? JsonMenuItem.findOne(query) : MongoMenuItem.findOne(query),
  findById: (id) => getUseLocalJsonDB() ? JsonMenuItem.findById(id) : MongoMenuItem.findById(id),
  create: (data) => getUseLocalJsonDB() ? JsonMenuItem.create(data) : MongoMenuItem.create(data),
  findByIdAndUpdate: (id, data, options) => getUseLocalJsonDB() ? JsonMenuItem.findByIdAndUpdate(id, data, options) : MongoMenuItem.findByIdAndUpdate(id, data, options),
  findByIdAndDelete: (id) => getUseLocalJsonDB() ? JsonMenuItem.findByIdAndDelete(id) : MongoMenuItem.findByIdAndDelete(id),
  countDocuments: (query) => getUseLocalJsonDB() ? JsonMenuItem.countDocuments(query) : MongoMenuItem.countDocuments(query),
};

module.exports = MenuItemModelWrapper;
