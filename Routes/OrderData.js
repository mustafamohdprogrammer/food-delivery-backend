const express = require("express");
const router = express.Router();
const Order = require("../Modals/Orders");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // Use service from .env
  auth: {
    user: process.env.EMAIL_USER, // Email user from .env
    pass: process.env.EMAIL_PASS, // Email password from .env
  },
});

// Utility function to send order details email
async function sendOrderEmail(email, orderData) {
  const flatOrderData = Array.isArray(orderData) ? orderData.flat() : orderData;

  const orderSummary = flatOrderData
    .map((item, index) =>
      item.Order_date
        ? `Order Date: ${item.Order_date}`
        : `${index + 1}. ${item.name} (${item.qty} x ${item.size}) - ₹${item.price}`
    )
    .join("\n");

  const mailOptions = {
    from: `"Bistro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Order Details",
    text: `Thank you for your order!\n\nOrder Details:\n${orderSummary}\n\nWe hope you enjoy your purchase!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order email sent successfully to", email);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
}

// Route to handle order data
router.post("/orderData", async (req, res) => {
  const data = req.body.order_data;

  // Validate 'order_data' and 'order_date'
  if (!Array.isArray(data) || !req.body.order_date) {
    return res.status(400).send("Invalid data format: 'order_data' must be an array and 'order_date' is required.");
  }

  // Add order date to the beginning of the data array
  data.splice(0, 0, { Order_date: req.body.order_date });

  try {
    // Check if the user already has an order record
    const existingOrder = await Order.findOne({ email: req.body.email });

    if (!existingOrder) {
      // Create a new order record
      await Order.create({
        email: req.body.email,
        order_data: [data],
      });

      // Send order summary email
      await sendOrderEmail(req.body.email, data);

      return res.json({ success: true });
    }

    // Update the existing order record
    await Order.findOneAndUpdate(
      { email: req.body.email },
      { $push: { order_data: data } }
    );

    // Send order summary email
    await sendOrderEmail(req.body.email, data);

    res.json({ success: true });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).send("Server error: " + error.message);
  }
});

// Route to fetch user's order data
router.post("/myorderData", async (req, res) => {
  try {
    const myData = await Order.findOne({ email: req.body.email });

    if (!myData) {
      return res.status(404).send("No order data found for this email.");
    }

    res.json({ orderData: myData });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).send("Server error: " + error.message);
  }
});

module.exports = router;
