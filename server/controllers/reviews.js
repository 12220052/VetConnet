const Review = require("../models/review");

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const vetId = req.params.vetId;
    const clientId = req.user._id; // set by auth middleware
    const userRole = req.user.role;

    const newReview = new Review({ vetId, clientId, rating, comment });
    await newReview.save();

    res.status(201).json({ message: "Review added", review: newReview });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add review", details: err.message });
  }
};
// Update review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.reviewId;

    const updated = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true }
    );

    res.status(200).json({ message: "Review updated", review: updated });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update review", details: err.message });
  }
};

// Delete review
const removeReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete review", details: err.message });
  }
};

// Get reviews by vet
const getReviewsByVet = async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const reviews = await Review.find({ vetId }).populate("clientId", "name");
    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get reviews", details: err.message });
  }
};

module.exports = {
  addReview,
  updateReview,
  removeReview,
  getReviewsByVet,
};
