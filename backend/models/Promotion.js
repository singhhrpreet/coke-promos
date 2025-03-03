const mongoose = require("mongoose");

// Define Promotion Schema
const PromotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    expectedSalesImpact: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Promotion", PromotionSchema);
