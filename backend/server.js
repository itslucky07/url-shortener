import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import Url from "./urlModel.js";
import path from "path";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://lucky:lucky@lucky.qbw9rjl.mongodb.net/?retryWrites=true&w=majority&appName=lucky"
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.post("/api/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) return res.status(400).json({ error: "originalUrl is required" });
    // Basic normalization: ensure protocol exists
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

app.get("/api/admin/urls", async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 });
  res.json(urls);
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
