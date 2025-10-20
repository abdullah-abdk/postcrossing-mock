// server/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
app.use(bodyParser.json());

const MONGO = process.env.MONGO || 'mongodb://localhost:27017/postcrossing_demo';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Mongo connect error', err));

const { Schema } = mongoose;

/* Schemas */
const UserSchema = new Schema({
  username: String,
  email: String,
  profile: { name: String, country: String },
  createdAt: { type: Date, default: Date.now }
});

const AddressSchema = new Schema({
  userId: Schema.Types.ObjectId,
  name: String,
  street: String,
  city: String,
  postalCode: String,
  country: String,
  isDefault: Boolean
});

const PostcardSchema = new Schema({
  code: String,
  fromUserId: Schema.Types.ObjectId,
  toUserId: Schema.Types.ObjectId,
  fromAddressId: Schema.Types.ObjectId,
  toAddressId: Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  sentAt: Date,
  receivedAt: Date,
  status: { type: String, default: 'assigned' },
  message: String,
  metadata: Object
});

const PendingSendSchema = new Schema({
  userId: Schema.Types.ObjectId,
  addressId: Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});


// Each schema is converted into a Mongoose model to interact with MongoDB collections.
const User = mongoose.model('User', UserSchema);
const Address = mongoose.model('Address', AddressSchema);
const Postcard = mongoose.model('Postcard', PostcardSchema);
const PendingSend = mongoose.model('PendingSend', PendingSendSchema);

/* Helper */
async function generatePostcardCode(country) {
  // Very simple code generator: <country>-<7digit-timestamp-suffix>
  return `${country || 'XX'}-${Date.now().toString().slice(-7)}`;  //Generates a unique postcard code like PK-1234567 using the country code and timestamp.
}

/* Routes */

// 1️⃣ Register user
app.post('/register', async (req, res) => {
  try {
    const { username, email, name, country } = req.body;
    if (!username || !email)
      return res.status(400).send({ error: 'username & email required' });
    const user = await User.create({ username, email, profile: { name, country } });
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// 2️⃣ Add address
app.post('/users/:userId/addresses', async (req, res) => {
  try {
    const { userId } = req.params;
    const addr = await Address.create({ userId, ...req.body });
    res.send(addr);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// 3️⃣ Send request (pairing)
app.post('/send-request', async (req, res) => {
  try {
    const { userId, addressId, message } = req.body;
    if (!userId || !addressId)
      return res.status(400).send({ error: 'userId & addressId required' });

    // find an existing pending sender that's not current user
    const match = await PendingSend.findOneAndDelete(
      { userId: { $ne: userId } },
      { sort: { createdAt: 1 } }
    );

    if (match) {
      const toAddress = await Address.findById(match.addressId);
      const fromAddress = await Address.findById(addressId);
      const user = await User.findById(userId);
      const matchedUser = await User.findById(match.userId);

      const code1 = await generatePostcardCode(user?.profile?.country);
      const p1 = await Postcard.create({
        code: code1,
        fromUserId: userId,
        toUserId: match.userId,
        fromAddressId: addressId,
        toAddressId: toAddress._id,
        status: 'assigned',
        message: message || ''
      });

      const code2 = await generatePostcardCode(matchedUser?.profile?.country);
      const p2 = await Postcard.create({
        code: code2,
        fromUserId: match.userId,
        toUserId: userId,
        fromAddressId: toAddress._id,
        toAddressId: fromAddress._id,
        status: 'assigned',
        message: 'Reciprocal postcard!'
      });

      return res.send({ paired: true, yourOutgoing: p1, yourIncoming: p2 });
    } else {
      // add to queue
      await PendingSend.create({ userId, addressId });
      return res.send({
        paired: false,
        message: 'Added to pending queue. Will pair when someone else requests.'
      });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// 4️⃣ List user postcards
app.get('/users/:userId/postcards', async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await Postcard.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }]
    }).sort({ createdAt: -1 });
    res.send(list);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// 5️⃣ Mark postcard as sent/received
app.post('/postcards/:id/mark', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const p = await Postcard.findById(id);
    if (!p) return res.status(404).send({ error: 'not found' });
    if (action === 'sent') {
      p.sentAt = new Date();
      p.status = 'in_transit';
    }
    if (action === 'received') {
      p.receivedAt = new Date();
      p.status = 'received';
    }
    await p.save();
    res.send(p);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

/* 🧭 Generic GET Routes — For inspection/debugging */
// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get single user by ID
app.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send({ error: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get all addresses
app.get('/addresses', async (req, res) => {
  try {
    const addresses = await Address.find();
    res.send(addresses);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get all postcards
app.get('/postcards', async (req, res) => {
  try {
    const postcards = await Postcard.find();
    res.send(postcards);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get pending queue
app.get('/pending', async (req, res) => {
  try {
    const pending = await PendingSend.find();
    res.send(pending);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get all addresses for a specific user
app.get('/users/:userId/addresses', async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.send(addresses);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
