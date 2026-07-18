const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const seedData = require('./config/seed');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DineEase REST API' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/analytics', require('./routes/analytics'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database (real Mongo or JSON DB fallback)
  await connectDB();

  // Run seeding if necessary
  await seedData();

  app.listen(PORT, () => {
    console.log(`🚀 DineEase server running on port ${PORT}`);
  });
};

startServer();
