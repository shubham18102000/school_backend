// const mongoose = require("mongoose");

// const testimonialSchema = new mongoose.Schema({
//   name: String,
//   review: String,
//   stars: Number,
//   photo: String,
//   approved: { type: Boolean, default: false },
// });

// module.exports = mongoose.model("Testimonial", testimonialSchema);

const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: String,
  message: String,
  approved: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },  // 👈 added field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);

