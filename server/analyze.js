require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
console.log("ENV Loaded:", process.env.APP_NAME, process.env.APP_MODE);

const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "..")));

// API Route
app.post("/analyze", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  const wordArray = text.trim().split(/\s+/);
  const words = wordArray.length;

  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0).length;

  res.json({
    app: process.env.APP_NAME,
    mode: process.env.APP_MODE,
    summary: `Summary of ${words} words and ${sentences} sentences`,
    keywords: ["insight", "analysis", "summary"],
    readingTime: Math.ceil(words / 200),
    sentenceCount: sentences,
    wordCount: words,
  });
});

// Start server
app.listen(3000, () => {
  console.log("App running at http://localhost:3000");
});