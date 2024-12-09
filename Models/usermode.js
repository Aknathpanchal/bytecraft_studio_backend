const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: false, unique: true, sparse: true },
  phone: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  blogCount: { type: Number, default: 0 },
  userType: { type: String, required: true, enum: ['Artist', 'Buyer','Super-Admin', 'Admin'] },
  role: { type: String, enum: ['super-admin', 'admin', 'artist', 'buyer'], required: true },
  refreshToken: { type: String },
  // Address fields for updating user profile
  address: {
    line1: { type: String, default: '' },
    line2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    pincode: { type: String, default: '' },
  },
  gender: { type: String, required: false }, 
  birthdate: {
    type: Date,
  },
  website: {
    type: String,
    trim: true,
  },
  profilePhoto: { type: String }, // New field for profile photo
});

const User = mongoose.model('User', userSchema);
module.exports = User;
