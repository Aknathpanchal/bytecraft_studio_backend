const express = require('express');
const {
  createBuyer,
  getBuyer,
  updateBuyer,
  deleteBuyer,
} = require('../controllers/BuyerController');

const router = express.Router();

// Routes for buyer management
router.post('/', createBuyer); // Create a new buyer
router.get('/:userId', getBuyer); // Get buyer details by user ID
router.put('/:userId', updateBuyer); // Update buyer details
router.delete('/:userId', deleteBuyer); // Delete buyer

module.exports = router;
