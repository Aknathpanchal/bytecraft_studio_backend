const Product = require('../Models/Product');
const User = require('../Models/usermode');
const { v4: uuidv4 } = require('uuid'); // For generating unique product IDs
 
// Upload Product
const uploadProduct = async (req, res) => {
  const { productName, newPrice, oldPrice, size, description, paintedBy } = req.body;
  const userId = req.user.userId; // ID from token payload after authentication middleware
  const userRole = req.user.role; // role from token payload
 
  const allowedRoles = ['super-admin', 'admin', 'artist']; // roles allowed to add products
 
  // Check if the user has permission to upload a product
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "You do not have permission to upload a product." });
  }  
 
  // Check if there are between 1 and 5 images
  if (!req.files || req.files.length < 1 || req.files.length > 5) {
    return res.status(400).json({ message: "Please upload between 1 to 5 images." });
  }
 
  const imagePaths = req.files.map(file => file.path); // Assuming `file.path` holds the image path
 
  const newProduct = new Product({
    artistId: userId, // Set the artistId to the logged-in user's ID
    uploadedBy: {
      id: userId,
      role: userRole,
    },
    productId: uuidv4(),
    images: imagePaths,
    productName,
    newPrice,
    oldPrice,
    size,
    description,
    paintedBy,
  });
 
  try {
    // Start a session for transaction
    const session = await Product.startSession();
    session.startTransaction();
 
    // Save the product
    await newProduct.save({ session });
 
    // Update the user's products list with the new product ID
    await User.findByIdAndUpdate(
      userId,
      { $push: { products: newProduct._id } },
      { session }
    );
 
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
 
    res.status(201).json({ message: "Product uploaded successfully", product: newProduct });
  } catch (error) {
    console.error("Error uploading product:", error.message);
 
    // Rollback transaction in case of an error
    await session.abortTransaction();
    session.endSession();
 
    res.status(500).json({ message: "Error uploading product", error: error.message });
  }
};
 
exports.getProductss = async (req, res) => {
  try {
    const product = await Product.find();
    if (!product.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve product', error });
  }
};
 
module.exports = { uploadProduct };
 
