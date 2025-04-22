const express = require("express");
const router = express.Router();
const refundController = require("../controllers/refundController");

// POST refund
router.post("/refund", refundController.createRefund);

// GET all refunds
router.get("/getallrefund", refundController.getAllRefunds);

// GET payment amount by appointment ID
router.get(
  "/get-payment-amount/:appointmentId",
  refundController.getPaymentAmountByAppointmentId
);

// POST reject refund (only accessible by super admin)
router.post("/reject-refund", refundController.rejectRefund);

module.exports = router;
