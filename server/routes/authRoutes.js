const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const User = require("../models/user");
const Role = require("../models/Role");
const authenticateUser = require("../middleware/authMiddleware");

require("dotenv").config();

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Nodemailer config
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= SIGNUP =====================
router.post("/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    confirmpassword,
    role,
    contact_no,
    CID,
    vet_license,
    specialist,
    location,
    certifications,
    gender,
  } = req.body;

  if (!name || !email || !role) {
    return res
      .status(422)
      .send({ error: "Please fill all the required fields" });
  }

  if (role !== "expertise" && role !== "vet") {
    if (!password || !confirmpassword) {
      return res
        .status(422)
        .send({ error: "Password and confirm password are required" });
    }

    if (password !== confirmpassword) {
      return res.status(422).send({ error: "Passwords do not match" });
    }
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).send({ error: "User already exists" });
    }

    const roleData = await Role.findOne({ role_type: role });
    if (!roleData) {
      return res.status(422).send({ error: "Invalid role" });
    }

    let hashedPassword = null;

    if (role === "expertise") {
      const tempPassword = Math.random().toString(36).slice(-8);
      hashedPassword = await bcrypt.hash(tempPassword, 10);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Login Credentials",
        text: `Your login password is: ${tempPassword}`,
      });
    } else if (role !== "vet") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const formattedCertifications = Array.isArray(certifications)
      ? certifications.map((cert) => String(cert))
      : [];

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role_id: roleData._id,
      is_approved: role === "vet" ? false : true,
      contact_no: contact_no || null,
      CID: CID || null,
      vet_license: vet_license || null,
      specialist: specialist || null,
      location: location || null,
      certifications: formattedCertifications,
      gender: gender || null,
    });
    if (role === "client") {
      const otp = Math.floor(100000 + Math.random() * 900000);
      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`,
      });
    } else if (role === "vet") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Vet Registration Pending",
        text: "Your registration as a vet is pending approval.",
      });
    }

    await user.save();
    res.send({ message: "Registration successful" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).send({ error: err.message });
  }
});

// ============ GET EXPERTISE (Admin only) ===========
router.get(
  "/getExpertise",
  authenticateUser.authenticateUser,
  async (req, res) => {
    try {
      if (!req.user || req.user.role_id.role_type !== "superAdmin") {
        return res
          .status(403)
          .send({ error: "Access denied. Super Admin only." });
      }

      const roleExpertise = await Role.findOne({ role_type: "expertise" });
      if (!roleExpertise)
        return res.status(404).send({ error: "Expertise role not found" });

      const experts = await User.find({ role_id: roleExpertise._id });
      res.send(experts);
    } catch (error) {
      console.error("Error fetching expertise:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  }
);

// ============ UPDATE EXPERTISE ===========
router.put("/expertise/:id", async (req, res) => {
  try {
    const { CID, name, email, contact_no } = req.body;
    const expertise = await User.findByIdAndUpdate(
      req.params.id,
      { CID, name, email, contact_no },
      { new: true, runValidators: true }
    );

    if (!expertise) {
      return res.status(404).json({ error: "Expertise not found" });
    }
    res.json({ message: "Expertise updated successfully", expertise });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ============ GET VETS ===========
router.get("/vets", authenticateUser.authenticateUser, async (req, res) => {
  try {
    if (
      !req.user ||
      !["expertise", "superAdmin"].includes(req.user.role_id.role_type)
    ) {
      return res.status(403).send({ error: "Access denied." });
    }

    const roleVet = await Role.findOne({ role_type: "vet" });
    if (!roleVet) return res.status(404).send({ error: "Vet role not found" });

    const approvedVets = await User.find({
      role_id: roleVet._id,
      is_approved: true,
    });
    const pendingVets = await User.find({
      role_id: roleVet._id,
      is_approved: false,
    });

    res.send({ approved: approvedVets, pending: pendingVets });
  } catch (error) {
    console.error("Error fetching vets:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// ============ APPROVE/REJECT VET ===========
router.post("/approve-vet", async (req, res) => {
  const { email, isApproved, rejectionReason } = req.body;

  if (!email) return res.status(422).send({ error: "Email is required" });

  try {
    const roleVet = await Role.findOne({ role_type: "vet" });
    if (!roleVet) return res.status(404).send({ error: "Vet role not found" });

    const user = await User.findOne({ email, role_id: roleVet._id });
    if (!user) return res.status(404).send({ error: "Vet not found" });

    if (isApproved) {
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user.password = hashedPassword;
      user.is_approved = true;
      await user.save();

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Vet Registration Approved",
        text: `Your vet registration has been approved.\nYour temporary login password is: ${tempPassword}`,
      });

      return res.send({ message: "Vet approved and credentials sent." });
    } else {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Vet Registration Rejected",
        text: `Your vet registration was rejected.\nReason: ${
          rejectionReason || "No reason provided."
        }`,
      });

      await User.deleteOne({ email });
      return res.send({
        message: "Vet registration rejected and user removed.",
      });
    }
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// ============ VERIFY OTP ===========
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== parseInt(otp) || user.otpExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============ DELETE EXPERTISE ===========
router.delete("/deleteExpertise/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Expertise not found" });

    res.status(200).json({ message: "Expertise deleted successfully" });
  } catch (err) {
    console.error("Error deleting expertise:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ============ DELETE VET ===========
router.delete("/deleteVets/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "Vet not found" });

    res.status(200).json({ message: "Vet deleted successfully" });
  } catch (err) {
    console.error("Error deleting vet:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ============ USER COUNT PER ROLE ===========
router.get("/roles/user-count", async (req, res) => {
  try {
    const userCountByRole = await User.aggregate([
      {
        $group: {
          _id: "$role_id",
          userCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "_id",
          foreignField: "_id",
          as: "roleDetails",
        },
      },
      { $unwind: { path: "$roleDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          role_id: "$_id",
          role_type: "$roleDetails.role_type",
          userCount: 1,
        },
      },
    ]);

    if (userCountByRole.length === 0) {
      return res.json({
        message: "No users found or roles not assigned properly.",
        data: [],
      });
    }

    res.json(userCountByRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Email and password are required." });
  }

  const emailTrimmed = email.trim();
  const passwordTrimmed = password.trim();

  try {
    const user = await User.findOne({ email: emailTrimmed }).populate(
      "role_id"
    );
    console.log(user);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid credentials.............." });
    }

    const isMatch = await bcrypt.compare(passwordTrimmed, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role_id.role_type === "vet" && !user.is_approved) {
      return res
        .status(403)
        .json({ error: "Vet registration is pending approval" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role_id.role_type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    let redirectURL;
    switch (user.role_id.role_type) {
      case "superAdmin":
        redirectURL = "/superadmin/dashboard";
        break;
      case "vet":
        redirectURL = "/vet/dashboard";
        break;
      case "client":
        redirectURL = "/client/home";
        break;
      case "expertise":
        redirectURL = "/expertise/home";
        break;
      default:
        return res.status(400).json({ error: "Role not found." });
    }

    res.json({
      message: "Login successful",
      token,
      redirectURL,
      userData: user, // Include all user data here
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
