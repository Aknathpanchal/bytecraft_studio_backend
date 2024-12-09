const express = require('express');
const mongoose = require('mongoose');
const User = require('../Models/usermode'); // Adjust the path as necessary
const Product = require('../Models/Product');
const router = express.Router();
const authenticateToken = require('../Middlewares/authMiddleware');
const { uploadProduct } = require('../controllers/productController');
const multer = require('multer');
const { getProductss } = require("../controllers/productController");
// const {authenticateToken} =require("../Middlewares/authMiddleware")
 
// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products'); // specify your desired path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage, limits: { files: 5 } });
 
// Route to upload a new product
router.post('/upload', authenticateToken, upload.array('images', 5), uploadProduct);
 
router.get('/products/artist/:artistId', async (req, res) => {
  try {
    const artistId = new mongoose.Types.ObjectId(req.params.artistId); // Corrected line, using 'new'
 
    // Find products where artistId matches
    const products = await Product.find({ artistId: artistId });
 
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this artist' });
    }
    res.json(products); // Return the products
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching products for the artist', error });
  }
});
 
router.put('/products/:productId', async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const updatedData = req.body; // Expecting the updated product data in the request body
 
    // Update the product based on productId
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
 
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct); // Return the updated product
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error updating the product', error });
  }
});
 
router.delete('/products/:productId', async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
 
    // Delete the product based on productId
    const deletedProduct = await Product.findByIdAndDelete(productId);
 
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' }); // Confirm deletion
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error deleting the product', error });
  }
});
 
router.get('/products', async (req, res) => {
  try {
   
    // Find products where artistId matches
    const products = await Product.find();
 
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this artist' });
    }
   return res.json(products); // Return the products
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching products for the artist', error });
  }
});
 
router.get("/getproductsone/:id", async (req, res) => {
 
  try {
      const { id } = req.params;
      console.log(id);
 
      const individual = await Product.findOne({ id: id });
      console.log(individual + "ind mila hai");
 
      res.status(201).json(individual);
  } catch (error) {
      res.status(400).json(error);
  }
});
 
 
 
 
module.exports = router;
 
