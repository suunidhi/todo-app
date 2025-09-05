// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ========================
// Middleware
// ========================
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // serves index.html, CSS, JS from /public folder

// ========================
// MongoDB Connection
// ========================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // Exit app if DB fails
  });

// ========================
// Routes
// ========================
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes); // API route for tasks

// Default route for root
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running 🚀" });
});

// ========================
// Error Handling Middleware
// ========================
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
