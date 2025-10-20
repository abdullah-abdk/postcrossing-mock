import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  street: String,
  city: String,
  postalCode: String,
  country: String,
  isDefault: { type: Boolean, default: false }
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
