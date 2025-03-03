const express = require('express');
const Promotion = require('../models/Promotion');

const router = express.Router();

// Create Promotion
router.post("/", async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.validate();
    const savedPromotion = await promotion.save();
    res.status(201).json(savedPromotion);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get All Promotions
router.get("/", async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update Promotion
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json(promotion);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete Promotion
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndDelete(id);

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json({ message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;