const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const authenticateUser = require("../middleware/authMiddleware");

router.post(
  "/addTestimonial",
  authenticateUser.authenticateUser,
  async (req, res) => {
    try {
      const { Review } = req.body;
      const { name, email } = req.user; //

      if (!Review) {
        return res.status(400).json({ error: "Review is required." });
      }

      const newTestimonial = new Testimonial({ name, email, Review });
      await newTestimonial.save();

      res.status(201).json({
        message: "Testimonial added successfully",
        testimonial: newTestimonial,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error adding testimonial", details: error.message });
    }
  }
);

router.get("/getTestimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ Date: -1 }); // Sort by latest first
    res.status(200).json({ testimonials });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching testimonials", details: error.message });
  }
});

module.exports = router;
