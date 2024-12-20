const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created it
  createdAt: { type: Date, default: Date.now }
});

const Artwork = mongoose.model('Artwork', artworkSchema);
module.exports = Artwork;
