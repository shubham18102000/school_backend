// const express = require("express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const Testimonial = require("../models/Testimonial");

// const router = express.Router();
// const SECRET = process.env.JWT_SECRET;
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// // Hardcoded login (secure it later)
// router.post("/login", async (req, res) => {
//   const { password } = req.body;
//   if (password !== ADMIN_PASSWORD)
//     return res.status(401).json({ error: "Unauthorized" });

//   const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "2h" });
//   res.json({ token });
// });

// // Middleware
// const verifyToken = (req, res, next) => {
//   const auth = req.headers.authorization;
//   if (!auth) return res.sendStatus(401);

//   try {
//     const token = auth.split(" ")[1];
//     jwt.verify(token, SECRET);
//     next();
//   } catch {
//     res.sendStatus(403);
//   }
// };

// // GET: All pending testimonials
// router.get("/pending", verifyToken, async (req, res) => {
//   const pending = await Testimonial.find({ approved: false });
//   res.json(pending);
// });

// // POST: Approve
// router.post("/approve/:id", verifyToken, async (req, res) => {
//   await Testimonial.findByIdAndUpdate(req.params.id, { approved: true });
//   res.json({ message: "Approved" });
// });

// // POST: Reject/Delete
// router.post("/reject/:id", verifyToken, async (req, res) => {
//   await Testimonial.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// });

// // GET: All testimonials (Admin only)
// router.get("/all", verifyToken, async (req, res) => {
//   try {
//     const allTestimonials = await Testimonial.find().sort({ createdAt: -1 });
//     res.json(allTestimonials);
//   } catch (err) {
//     console.error("Error fetching all testimonials:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// module.exports = router;
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Testimonial = require("../models/Testimonial");

const router = express.Router();
const SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Hardcoded login (secure it later)
router.post("/login", async (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD)
    return res.status(401).json({ error: "Unauthorized" });

  const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "2h" });
  res.json({ token });
});

// Middleware
const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);

  try {
    const token = auth.split(" ")[1];
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
};

// GET: All pending testimonials
router.get("/pending", verifyToken, async (req, res) => {
  const pending = await Testimonial.find({ approved: false });
  res.json(pending);
});

// POST: Approve
router.post("/approve/:id", verifyToken, async (req, res) => {
  await Testimonial.findByIdAndUpdate(req.params.id, { approved: true });
  res.json({ message: "Approved" });
});

// POST: Reject/Delete (alias)
router.post("/reject/:id", verifyToken, async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// DELETE: Remove testimonial (explicit delete option)
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted permanently" });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH: Toggle visibility (visible / hidden)
router.patch("/visibility/:id", verifyToken, async (req, res) => {
  const { visible } = req.body; // expect true or false
  try {
    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { visible },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ message: `Visibility updated to ${visible}`, testimonial: updated });
  } catch (err) {
    console.error("Error updating visibility:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: All testimonials (Admin only)
router.get("/all", verifyToken, async (req, res) => {
  try {
    const allTestimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(allTestimonials);
  } catch (err) {
    console.error("Error fetching all testimonials:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
