const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getMessages } = require("../controllers/messageController");

const router = express.Router();

// Message Routes
router.get("/:to", protect, getMessages); // Get all messages between two users

module.exports = router;
