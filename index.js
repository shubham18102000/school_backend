const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// CORS setup
app.use(cors({
  origin: [
    "http://localhost:5173",  // local development
    "https://sspsrosera.com", // production site
  ],
  credentials: true,
}));

app.use(express.json());

// ✅ No need for this with Cloudinary:
// app.use("/uploads", express.static("uploads"));

// ✅ Connect to MongoDB using async/await
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

connectDB();

// ✅ API routes
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/admin", require("./routes/admin"));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


