const User = require("../models/userModels");
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json({ status: "success", results: users.length, data: users });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    console.log(req.body.name);
    res.json({ data: newUser, status: "success" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const newUser = await User.findById(req.params.id);
    res.json({ data: newUser, status: "success" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const newUser = await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({ data: newUser, status: "success" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
};
