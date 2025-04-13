const express = require("express");
const router = express.Router();
const Role = require("../models/Role"); // Adjust path if necessary

router.get("/roles", async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/roles/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/roles", async (req, res) => {
  const { role_id, role_type, role_description } = req.body;

  if (!role_id || !role_type || !role_description) {
    return res
      .status(400)
      .json({ error: "role_id, role_type, and role_description are required" });
  }

  try {
    const existingRole = await Role.findOne({ role_id });
    if (existingRole) {
      return res.status(400).json({ error: "Role ID already exists" });
    }

    const newRole = new Role({ role_id, role_type, role_description });
    await newRole.save();
    res.status(201).json({ message: "Role added successfully", role: newRole });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/roles/:id", async (req, res) => {
  const { role_type, role_description } = req.body;

  if (!role_type && !role_description) {
    return res
      .status(400)
      .json({
        error: "At least one field (role_type or role_description) is required",
      });
  }

  try {
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { role_type, role_description },
      { new: true }
    );
    if (!updatedRole) return res.status(404).json({ error: "Role not found" });
    res.json({ message: "Role updated successfully", role: updatedRole });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/roles/:id", async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
