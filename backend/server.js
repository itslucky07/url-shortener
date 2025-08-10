// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // ✅ Keep only this import, removed duplicate require()
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import Url from "./urlModel.js";
import path from "path";

dotenv.config(); // ✅ Loads environment variables from .env

const app = express();

// ✅ Allow frontend to access backend (replace * with frontend URL after deploy)
app.use(cors({
    origin: '*', // e.g. "https://your-frontend.netlify.app" after deployment
    methods: ['GET', 'POST']
}));

app.use(express.json());

// ✅ Get values from .env for deployment flexibility
const MONGO_URI = process.env.MONGO_URI; 
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// ✅ MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Route to shorten URL
app.post("/api/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ error: "originalUrl is required" });

    // ✅ Ensure protocol exists
    let normalized = originalUrl;
    if (!/^https?:\/\//i.test(normalized)) normalized = "https://" + normalized;

    const shortCode = nanoid(6);
    const newUrl = new Url({ originalUrl: normalized, shortCode });
    await newUrl.save();

    return res.json({ shortUrl: `${BASE_URL}/${shortCode}`, shortCode });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Admin route to list URLs
app.get("/api/admin/urls", async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 });
  res.json(urls);
});

// Redirect route
app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).send("Short URL not found");

    url.visits = (url.visits || 0) + 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// ✅ Render will set its own port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀Server running on port ${PORT}`));
