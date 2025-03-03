import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/coke-promos";
console.log(MONGO_URI)

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define Promotion Schema
const promotionSchema = new mongoose.Schema(
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

const Promotion = mongoose.model("Promotion", promotionSchema);

// API Routes
const router = express.Router();

// Get all promotions
router.get("/promotions", async (req, res) => {
    try {
        const promotions = await Promotion.find().sort({ createdAt: -1 });
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Create a new promotion
router.post("/promotions", async (req, res) => {
    try {
        const promotion = new Promotion(req.body);
        await promotion.validate();
        const savedPromotion = await promotion.save();
        res.status(201).json(savedPromotion);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error", error: error.message });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update a promotion
router.put("/promotions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const promotion = await Promotion.findByIdAndUpdate(id, req.body, { new: true });

        if (!promotion) {
            return res.status(404).json({ message: "Promotion not found" });
        }

        res.json(promotion);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error", error: error.message });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete a promotion
router.delete("/promotions/:id", async (req, res) => {
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

// Use API routes
app.use("/api", router);

// Serve static assets in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(join(__dirname, "../dist")));

    app.get("*", (req, res) => {
        res.sendFile(join(__dirname, "../dist/index.html"));
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
