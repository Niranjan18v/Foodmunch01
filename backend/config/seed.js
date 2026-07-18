const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const Reservation = require('../models/Reservation');
const Review = require('../models/Review');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(' Database already seeded. Skipping...');
      return;
    }

    console.log(' Seeding database...');

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin Manager',
      email: 'admin@dineease.com',
      password: hashedPassword,
      role: 'admin',
      phone: '9786992111'
    });

    const staff = await User.create({
      name: 'Staff Server',
      email: 'staff@dineease.com',
      password: hashedPassword,
      role: 'staff',
      phone: '8986998778'
    });

    const customer = await User.create({
      name: 'Jane Customer',
      email: 'customer@dineease.com',
      password: hashedPassword,
      role: 'customer',
      phone: '5489669878'
    });

    console.log(' Seeded Users: admin@dineease.com, staff@dineease.com, customer@dineease.com (password: password123)');

   
    const tables = [
      { number: 'Table 1', capacity: 2, status: 'available' },
      { number: 'Table 2', capacity: 2, status: 'available' },
      { number: 'Table 3', capacity: 4, status: 'available' },
      { number: 'Table 4', capacity: 4, status: 'available' },
      { number: 'Table 5', capacity: 4, status: 'available' },
      { number: 'Table 6', capacity: 6, status: 'available' },
      { number: 'Table 7', capacity: 6, status: 'available' },
      { number: 'Table 8', capacity: 8, status: 'available' }
    ];

    const createdTables = [];
    for (const t of tables) {
      const created = await Table.create(t);
      createdTables.push(created);
    }
    console.log(`Seeded ${createdTables.length} restaurant tables`);

    
    const menuItems = [
      {
        name: 'Crispy Calamari',
        description: 'Tender calamari rings, lightly dusted and fried to golden perfection, served with garlic aioli.',
        price: 349,
        category: 'seafood',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Truffle Stuffed Mushrooms',
        description: 'Button mushrooms filled with a savory blend of herbs, cream cheese, and parmesan, baked golden brown.',
        price: 299,
        category: 'veg',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Bruschetta Classica',
        description: 'Grilled rustic bread rubbed with garlic, topped with vine-ripened tomatoes, fresh basil, and extra virgin olive oil.',
        price: 249,
        category: 'veg',
        image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Grilled Ribeye Steak',
        description: 'Premium 12oz ribeye cut, grilled to perfection, served with garlic mashed potatoes and grilled asparagus.',
        price: 1299,
        category: 'non-veg',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Citrus Glazed Salmon',
        description: 'Pan-seared Atlantic salmon glazed with citrus herb butter, served with wild rice and steamed seasonal veggies.',
        price: 899,
        category: 'seafood',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Truffle Mushroom Risotto',
        description: 'Creamy arborio rice cooked with wild forest mushrooms, white wine, finished with truffle oil and shaved parmesan.',
        price: 749,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm, rich chocolate cake with a molten chocolate center, served with vanilla bean gelato.',
        price: 249,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Classic Crème Brûlée',
        description: 'Rich vanilla bean custard base topped with a contrasting layer of hardened caramelized sugar.',
        price: 199,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed sweet oranges with no added sugar.',
        price: 150,
        category: 'fresh-juices',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Watermelon Breeze',
        description: 'Chilled refreshing watermelon juice with a hint of mint.',
        price: 130,
        category: 'fresh-juices',
        image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Chicken Biriyani',
        description: 'Aromatic basmati rice layered with spiced chicken, slow-cooked to perfection.',
        price: 399,
        category: 'non-veg',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Mutton Biriyani',
        description: 'Tender mutton pieces cooked with fragrant rice and authentic spices.',
        price: 499,
        category: 'non-veg',
        image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Fish Biriyani',
        description: 'Fresh fish marinated in special spices, cooked with flavorful basmati rice.',
        price: 450,
        category: 'non-veg',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Prawn Biryani',
        description: 'Juicy prawns layered with spiced saffron rice and garnished with fried onions.',
        price: 499,
        category: 'non-veg',
        image: 'https://images.unsplash.com/photo-1626779836528-976269eb4a3c?auto=format&fit=crop&w=600&q=80',
        availability: true
      },
      {
        name: 'Chicken Gravi',
        description: 'Rich and spicy chicken curry, perfect to pair with rice or naan.',
        price: 350,
        category: 'non-veg',
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
        availability: true
      }
    ];

    for (const m of menuItems) {
      await MenuItem.create(m);
    }
    console.log(' Seeded Digital Menu items');

   
    const reviews = [
      {
        user: customer._id,
        rating: 5,
        comment: 'Absolutely amazing steak and wonderful customer service. Table booking was flawless!',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        user: admin._id, 
        rating: 4,
        comment: 'Nice selection of desserts, chocolate lava cake is highly recommended.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    for (const r of reviews) {
      await Review.create(r);
    }
    console.log(' Seeded Customer Reviews');

   
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const reservations = [
      {
        user: customer._id,
        table: createdTables[2]._id, 
        date: today,
        timeSlot: '19:00',
        guestsCount: 4,
        status: 'confirmed',
        specialRequests: 'Window table if possible, anniversary dinner.'
      },
      {
        user: customer._id,
        table: createdTables[0]._id, 
        date: tomorrow,
        timeSlot: '18:00',
        guestsCount: 2,
        status: 'pending',
        specialRequests: 'Gluten-free menu items please.'
      },
      {
        user: customer._id,
        table: createdTables[5]._id, 
        date: yesterday,
        timeSlot: '20:30',
        guestsCount: 5,
        status: 'completed',
        specialRequests: ''
      }
    ];

    for (const resv of reservations) {
      await Reservation.create(resv);
    }
    console.log('Seeded Test Reservations');
    console.log(' Seeding process complete!');
  } catch (error) {
    console.error(' Error seeding database:', error);
  }
};

module.exports = seedData;
