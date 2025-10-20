// seed.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';
import Address from './models/address.js';

dotenv.config();

mongoose.connect(process.env.MONGO);

async function seed() {
  try {
    await User.deleteMany({});
    await Address.deleteMany({});

    const users = await User.insertMany([
      { username: 'alice', email: 'alice@example.com' },
      { username: 'ben', email: 'ben@example.com' },
      { username: 'chloe', email: 'chloe@example.com' },
      { username: 'david', email: 'david@example.com' },
      { username: 'ella', email: 'ella@example.com' },
      { username: 'farah', email: 'farah@example.com' },
      { username: 'george', email: 'george@example.com' },
      { username: 'hiroshi', email: 'hiroshi@example.com' }
    ]);

    const addresses = await Address.insertMany([
      { userId: users[0]._id, name: 'Alice', street: '1 Road', city: 'NY', postalCode: '10001', country: 'US', isDefault: true },
      { userId: users[1]._id, name: 'Ben', street: '2 Lane', city: 'Beijing', postalCode: '100000', country: 'CN', isDefault: true },
      { userId: users[2]._id, name: 'Chloe', street: '3 Ave', city: 'Santiago', postalCode: '8320000', country: 'CL', isDefault: true },
      { userId: users[3]._id, name: 'David', street: '4 Strasse', city: 'Berlin', postalCode: '10115', country: 'DE', isDefault: true },
      { userId: users[4]._id, name: 'Ella', street: '5 Lane', city: 'London', postalCode: 'W1A', country: 'UK', isDefault: true },
      { userId: users[5]._id, name: 'Farah', street: '6 Street', city: 'Lahore', postalCode: '54000', country: 'PK', isDefault: true },
      { userId: users[6]._id, name: 'George', street: '7 Street', city: 'Mumbai', postalCode: '400001', country: 'IN', isDefault: true },
      { userId: users[7]._id, name: 'Hiroshi', street: '8 Ave', city: 'Tokyo', postalCode: '100-0001', country: 'JP', isDefault: true }
    ]);

    console.log('✅ Seeded users and addresses successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
