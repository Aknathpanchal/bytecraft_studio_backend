const User = require('../Models/usermode');
const Buyer = require('../Models/Buyer');

// Create a new buyer
const createBuyer = async (req, res) => {
  try {
    const { name, lastName, email, phone, password, wishlist, cart, orders } = req.body;

    // Create the user
    const user = new User({
      name,
      lastName,
      email,
      phone,
      password,
      userType: 'Buyer',
      role: 'buyer',
    });
    await user.save();

    // Create the buyer record
    const buyer = new Buyer({
      user: user._id,
      wishlist,
      cart,
      orders,
    });
    await buyer.save();

    res.status(201).json({ message: 'Buyer created successfully', user, buyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get buyer details
const getBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findOne({ user: req.params.userId })
      .populate('user')
      .populate('wishlist')
      .populate('cart.product')
      .populate('orders');

    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update buyer
const updateBuyer = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, wishlist, cart } = req.body;

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    // Update buyer
    const buyer = await Buyer.findOneAndUpdate(
      { user: userId },
      { wishlist, cart },
      { new: true }
    );

    res.status(200).json({ message: 'Buyer updated successfully', user, buyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete buyer
const deleteBuyer = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete buyer record
    await Buyer.findOneAndDelete({ user: userId });

    // Delete user record
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Buyer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBuyer,
  getBuyer,
  updateBuyer,
  deleteBuyer,
};
