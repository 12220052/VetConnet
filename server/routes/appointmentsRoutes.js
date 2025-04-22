// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment");

// Route to book an appointment
router.post("/book/:vetId", appointmentController.bookAppointment);

// // Route to get all appointments
// router.get("/appointments", appointmentController.getAllAppointments);

// // Route to get a single appointment by ID
// router.get("/appointment/:id", appointmentController.getAppointmentById);

// // Route to update an appointment
// router.put(
//   "/appointment/:id",
//   //   authenticateUser,
//   appointmentController.updateAppointment
// );

// // Route to delete an appointment
// router.delete(
//   "/appointment/:id",
//   //   authenticateUser,
//   appointmentController.deleteAppointment
// );

module.exports = router;
