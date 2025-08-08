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

// POST: Reject/Delete
router.post("/reject/:id", verifyToken, async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
