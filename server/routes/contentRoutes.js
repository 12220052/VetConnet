const express = require("express");
const Post = require("../models/contentSchema");

const router = express.Router();

// CREATE
router.post("/createContent", async (req, res) => {
  try {
    let postData = req.body;

    // Remove empty/null fields
    Object.keys(postData).forEach((key) => {
      if (postData[key] === "" || postData[key] === null) {
        delete postData[key];
      }
    });

    const newPost = new Post(postData);
    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating post", details: error.message });
  }
});

// READ ALL
router.get("/allContent", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching posts", details: error.message });
  }
});

// UPDATE
router.put("/updatecontent/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const updateData = req.body;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "" || updateData[key] === null) {
        delete updateData[key];
      }
    });

    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating post", details: error.message });
  }
});

// DELETE
router.delete("/deletecontent/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res
      .status(200)
      .json({ message: "Post deleted successfully", post: deletedPost });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting post", details: error.message });
  }
});

// GET FAQs
router.get("/getbanner", async (req, res) => {
  try {
    const faqs = await Post.find({ contentType: "faq" });
    res.status(200).json(faqs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch FAQs", details: err.message });
  }
});
router.post("/createfaq", async (req, res) => {
  try {
    const { Question, Answer } = req.body;

    const newContent = new Content({
      Question,
      Answer,
      contentType: "faq", // Optional default, you can change it
    });

    await newContent.save();
    res.status(201).json(newContent);
  } catch (err) {
    console.error("Error creating content:", err);
    res.status(500).json({ message: "Error creating content", error: err });
  }
});

module.exports = router;
