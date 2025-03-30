const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const User = require("../model/User");
const Role = require("../model/Role");

require("dotenv").config();
// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store files in the "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
    if (!req.body.password || !req.body.confirmpassword) {
      return res
        .status(422)
        .send({ error: "Password and confirm password are required" });
    }

    if (req.body.password !== req.body.confirmpassword) {
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

    // For "expertise" role, generate a temp password
    if (role === "expertise") {
      const tempPassword = Math.random().toString(36).slice(-8);
      hashedPassword = await bcrypt.hash(tempPassword, 10);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Login Credentials",
        text: `Your login password is: ${tempPassword}`,
      });
    }

    // For "vet" role, set password to null (no password yet)
    else if (role !== "vet") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // let user = new User({
    //     name,
    //     email,
    //     password: hashedPassword,  // Password is null for "vet"
    //     role_id: roleData._id,
    //     is_approved: role === "vet" ? false : true
    // });
    //  Convert certifications to an array of strings
    const formattedCertifications = Array.isArray(certifications)
      ? certifications.map((cert) => String(cert))
      : [];
    let user = new User({
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

    // Additional role-specific processing
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
    console.log("db.err", err);
    return res.status(500).send({ error: err.message });
  }
});

router.get("/vets", async (req, res) => {
  try {
    const roleVet = await Role.findOne({ role_type: "vet" });
    if (!roleVet) return res.status(404).send({ error: "Vet role not found" });

    const vets = await User.find({ role_id: roleVet._id });

    res.send(vets);
  } catch (error) {
    console.error("Error fetching vets:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/approve-vet", async (req, res) => {
  const { email, isApproved, rejectionReason } = req.body;

  if (!email) return res.status(422).send({ error: "Email is required" });

  try {
    const roleVet = await Role.findOne({ role_type: "vet" });
    if (!roleVet) return res.status(404).send({ error: "Vet role not found" });

    const user = await User.findOne({ email, role_id: roleVet._id });
    if (!user) return res.status(404).send({ error: "Vet not found" });

    if (isApproved) {
      // Generate and hash temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user.password = hashedPassword;
      user.is_approved = true;
      await user.save();

      // Send approval email with login credentials
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Vet Registration Approved",
        text: `Your vet registration has been approved.\n\nYour temporary login password is: ${tempPassword}`,
      });

      return res.send({
        message: "Vet approved successfully and login credentials sent.",
      });
    } else {
      // Send rejection email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Vet Registration Rejected",
        text: `Your vet registration has been rejected.\n\nReason: ${
          rejectionReason || "No specific reason provided."
        }`,
      });

      // Optionally, delete the rejected vet account
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
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(422).send({ error: "Please fill all the fields" });
  }

  User.findOne({ email: email, otp: otp, otpExpiry: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).send({ error: "Invalid OTP or OTP expired" });
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;

      user
        .save()
        .then(() => {
          res.send({ message: "Email verified successfully" });
        })
        .catch((err) => {
          console.log("db.err", err);
          return res.status(422).send({ error: err.message });
        });
    })
    .catch((err) => {
      console.log("db.err", err);
      return res.status(422).send({ error: err.message });
    });
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

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(422).send({ error: "credentials required " });

//     }
//     const savedUser = await User.findOne({ email: email })
//     if (!savedUser) {
//         return res.status(422).json({ error: "Invalid Credentials" })
//     }
//     try {
//         bcrypt.compare(password, savedUser.password, (err, result) => {
//             if (result) {
//                 console.log("password match")
//                 const token = jwt.sign({ _id: savedUser._id }, process.env.jwt_secret);
//                 res.send({ token })
//             }
//             else {
//                 console.log('password doesnot match')
//                 return res.status(422).json({ error: "Invalid Credentials" })
//             }

//         })
//     }
//     catch (err) {
//         console.log(err)
//     }

// })

module.exports = router;
