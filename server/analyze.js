require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.post("/analyze", upload.single("file"), (req, res) => {
  let text = req.body.text;

  if (req.file) {
    text = fs.readFileSync(req.file.path, "utf8");
    fs.unlinkSync(req.file.path);
  }

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  // ---- Sentence Split ----
  const rawSentences = text.match(/[^.!?]+[.!?]*/g) || [];
  const sentences = rawSentences.map(s => s.trim()).filter(Boolean);

  // ---- Stopwords ----
  const stopWords = new Set([
    "the","is","in","at","of","a","and","to","for","on","with",
    "as","by","an","be","this","that","are","from","or","it"
  ]);

  // ---- Word Frequency ----
  const freq = {};
  const minLen = parseInt(process.env.MIN_WORD_LENGTH) || 4;

  sentences.forEach(sentence => {
    const words = sentence.toLowerCase().match(/\b[a-z]+\b/g) || [];

    words.forEach(word => {
      if (!stopWords.has(word) && word.length >= minLen) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });
  });

  // ---- Score Sentences ----
  const scored = sentences.map(sentence => {
    const words = sentence.toLowerCase().match(/\b[a-z]+\b/g) || [];

    let score = 0;
    words.forEach(word => {
      if (freq[word]) score += freq[word];
    });

    return { sentence, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const limit = parseInt(process.env.SUMMARY_SENTENCES) || 3;

  const summarySentences = scored.slice(0, limit).map(s => s.sentence);
  const summary = sentences.filter(s => summarySentences.includes(s)).join(" ");

  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(entry => entry[0]);

  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  res.json({
    app: process.env.APP_NAME,
    mode: process.env.APP_MODE,
    summary,
    keywords,
    readingTime,
    sentenceCount: sentences.length,
    wordCount
  });
});

app.listen(3000, () => {
  console.log("App running at http://localhost:3000");
});