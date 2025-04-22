const Refund = require("../models/Refund");
const Appointment = require("../models/Appointment");
const nodemailer = require("nodemailer");
const User = require("../models/user");

// Create a new refund
exports.createRefund = async (req, res) => {
  const { appointmentId, cancellationReason, accountDetails } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const refund = new Refund({
      appointmentId,
      clientId: appointment.clientId,
      vetId: appointment.vetId,
      cancellationReason,
      accountDetails: {
        ...accountDetails,
        amount: appointment.paymentAmount,
      },
    });

    await refund.save();

    res.status(201).json({
      message: "Refund submitted successfully",
      data: refund,
    });
  } catch (err) {
    console.error("Error submitting refund:", err);
    res.status(500).json({
      message: "Failed to submit refund",
    });
  }
};

// Get all refunds with appointment date/time and user info
exports.getAllRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find()
      .populate({
        path: "appointmentId",
        select: "appointmentDate startTime endTime",
      })
      .populate({
        path: "vetId",
        select: "name email",
      })
      .populate({
        path: "clientId",
        select: "name email",
      });

    res.status(200).json(refunds);
  } catch (err) {
    console.error("Error fetching refunds:", err);
    res.status(500).json({
      message: "Failed to fetch refunds",
    });
  }
};

// Get payment amount by appointment ID
exports.getPaymentAmountByAppointmentId = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId).select(
      "paymentAmount"
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ paymentAmount: appointment.paymentAmount });
  } catch (err) {
    console.error("Error fetching payment amount:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Nodemailer transporter config
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Email credentials not set in environment variables");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send rejection email
async function sendRejectionEmail(userEmail, userName, rejectionReason) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Refund Request Rejected",
    text: `Dear ${userName},\n\nWe regret to inform you that your refund request has been rejected for the following reason:\n\n${rejectionReason}\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nYour Company Name`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Rejection email sent successfully");
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }
}

// Reject refund request and send email
exports.rejectRefund = async (req, res) => {
  const { refundId, rejectionReason } = req.body;

  try {
    const refund = await Refund.findById(refundId).populate(
      "clientId",
      "email name"
    );

    if (!refund) {
      return res.status(404).json({ message: "Refund request not found" });
    }

    const clientEmail = refund.clientId.email;
    const clientName = refund.clientId.name;

    // Send rejection email
    await sendRejectionEmail(clientEmail, clientName, rejectionReason);

    // Delete refund request
    await Refund.findByIdAndDelete(refundId);

    res.status(200).json({
      message: "Refund request rejected, email sent, and record deleted",
    });
  } catch (error) {
    console.error("Error rejecting refund request:", error);
    res.status(500).json({
      message: "Failed to reject refund request",
    });
  }
};
