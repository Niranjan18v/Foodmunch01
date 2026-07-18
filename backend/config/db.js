const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let useLocalJsonDB = false;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log(' MONGO_URI not found in env. Falling back to local JSON database.');
    useLocalJsonDB = true;
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB connection error: ${error.message}`);
    console.log(' Falling back to local JSON database...');
    useLocalJsonDB = true;
  }
};

const getUseLocalJsonDB = () => useLocalJsonDB;

class JsonModel {
  constructor(collectionName) {
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  _read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  _matches(item, query) {
    if (!query) return true;
    return Object.keys(query).every(key => {
      const val = query[key];
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        return Object.keys(val).every(op => {
          if (op === '$gte') return item[key] >= val[op];
          if (op === '$lte') return item[key] <= val[op];
          if (op === '$gt') return item[key] > val[op];
          if (op === '$lt') return item[key] < val[op];
          if (op === '$ne') return item[key] !== val[op];
          if (op === '$in') return Array.isArray(val[op]) && val[op].includes(item[key]);
          return false;
        });
      }
      return item[key] === val;
    });
  }

  find(query = {}) {
    const data = this._read();
    let results = data.filter(item => this._matches(item, query));
    
    const populateChain = {
      populate: (field) => {
        results = results.map(item => {
          const newItem = { ...item };
          const targetId = newItem[field];
          if (targetId) {
            let refCollection = '';
            if (field === 'user') refCollection = 'users';
            else if (field === 'table') refCollection = 'tables';
            else if (field === 'menuItem') refCollection = 'menuitems';

            if (refCollection) {
              const refModel = new JsonModel(refCollection);
              const refData = refModel._read();
              const refObj = refData.find(r => r._id === targetId);
              if (refObj) {
                const cleanedObj = { ...refObj };
                if (cleanedObj.password) delete cleanedObj.password;
                newItem[field] = cleanedObj;
              }
            }
          }
          return newItem;
        });
        return populateChain;
      },
      sort: (sortOption) => {
        return populateChain;
      },
      exec: async () => results,
      then: (onFulfilled, onRejected) => {
        return Promise.resolve(results).then(onFulfilled, onRejected);
      }
    };

    return Object.assign(Promise.resolve(results), populateChain);
  }

  async findOne(query = {}) {
    const data = this._read();
    const result = data.find(item => this._matches(item, query));
    return result || null;
  }

  async findById(id) {
    const data = this._read();
    const result = data.find(item => item._id === id);
    return result || null;
  }

  async create(docData) {
    const data = this._read();
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...docData
    };
    data.push(newDoc);
    this._write(data);
    return newDoc;
  }

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    const data = this._read();
    const index = data.findIndex(item => item._id === id);
    if (index === -1) return null;

    const updatedDoc = {
      ...data[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    data[index] = updatedDoc;
    this._write(data);
    return updatedDoc;
  }

  async findByIdAndDelete(id) {
    const data = this._read();
    const index = data.findIndex(item => item._id === id);
    if (index === -1) return null;

    const deleted = data.splice(index, 1)[0];
    this._write(data);
    return deleted;
  }

  async countDocuments(query = {}) {
    const data = this._read();
    return data.filter(item => this._matches(item, query)).length;
  }
}

module.exports = {
  connectDB,
  getUseLocalJsonDB,
  JsonModel
};
