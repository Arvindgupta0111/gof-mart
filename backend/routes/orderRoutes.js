
const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
console.log("Order model type:", typeof Order);
console.log("Order.create type:", typeof Order.create);
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { customer, items, paymentMethod } = req.body;

    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.address ||
      !customer?.city ||
      !customer?.pincode ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Valid customer details and cart items are required.",
      });
    }

    if (paymentMethod && paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Only Cash on Delivery is currently supported.",
      });
    }

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item._id) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Invalid product or quantity.",
        });
      }

      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(400).json({
          message: `Product not found: ${item.name || item._id}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}.`,
        });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      total += product.price * item.quantity;
    }

    const order = await Order.create({
      userId: req.user.userId,
      customer,
      items: orderItems,
      total,
      paymentMethod: "COD",
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Failed to place order." });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

module.exports = router;
