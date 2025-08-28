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
  review: { type: String, required: true },   // user review text
  stars: { type: Number, required: true },    // rating stars
  photo: { type: String },                    // Cloudinary URL
  approved: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },  // 👈 added field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);

