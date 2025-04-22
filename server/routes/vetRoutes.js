const express = require("express");
const router = express.Router();
const vetController = require("../controller/vetController");
const authMiddleware = require("../middleware/authMiddleware");
// At the top of vetRoutes.js
const { initializeSchedule } = require("../controller/vetController");
const Schedule = require("../model/Schedule");

// Protect all routes
router.use(authMiddleware.protect);

// Day availability routes
router
  .route("/availability/:userId")
  .get(vetController.getAvailability)
  .put(vetController.updateAvailability);

// Specific day routes
router
  .route("/availability/day/:userId/:day")
  .get(vetController.getDayAvailability);
// .put(vetController.updateSlots);

// Specific date routes
router
  .route("/availability/date/:userId/:date")
  .get(vetController.getDateSlots)
  .put(vetController.updateDaySlots);

// Specific vet routes
router
  .route("/vets/:id")
  .get(vetController.getVetById)
  .put(vetController.updateVet);

module.exports = router;
