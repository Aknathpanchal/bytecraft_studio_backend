const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Artwork = require('../Models/artwork');
const isArtist = require('../Middlewares/artistMiddleware');

// Create new artwork
router.post('/', async (req, res) => {
  const { title, description, imageUrl, artistId } = req.body;

  // Ensure artistId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(artistId)) {
    return res.status(400).json({ message: "Invalid artistId" });
  }

  const newArtwork = new Artwork({
    title,
    description,
    imageUrl,
    artistId: new mongoose.Types.ObjectId(artistId) // Ensure this line is correct
  });

  try {
    const savedArtwork = await newArtwork.save();
    res.status(201).json({ message: "Artwork created successfully", artwork: savedArtwork });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating artwork" });
  }
});

// Get all artworks by artist
router.get('/:artistId', async (req, res) => {
  const artistId = req.params.artistId;

  // Ensure artistId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(artistId)) {
    return res.status(400).json({ message: "Invalid artistId" });
  }

  try {
    const artworks = await Artwork.find({ artistId: mongoose.Types.ObjectId(artistId) });
    res.status(200).json(artworks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching artworks" });
  }
});

module.exports = router;
