const express = require("express");
const router = express.Router();

const {
  addReview,
  updateReview,
  removeReview,
  getReviewsByVet,
} = require("../controllers/reviews");

// Add review
router.post("/vet/:vetId/review", addReview);

// Delete review
router.delete("/review/:reviewId", removeReview);

// Get all reviews for a vet
router.get("/vet/:vetId/reviews", getReviewsByVet);

module.exports = router;
