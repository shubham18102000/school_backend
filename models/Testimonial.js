const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: String,
  review: String,
  stars: Number,
  photo: String,
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
