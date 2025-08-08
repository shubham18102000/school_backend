const express = require("express");
const multer = require("multer");
const Testimonial = require("../models/Testimonial");
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });
const router = express.Router();

// ✅ Submit a testimonial (unapproved initially)
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { name, review, stars } = req.body;
    const newTestimonial = new Testimonial({
      name,
      review,
      stars,
      photo: req.file?.path,
      approved: false,
    });

    await newTestimonial.save();
    res.json({ message: "Testimonial submitted for approval." });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get only approved testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ _id: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

module.exports = router;


