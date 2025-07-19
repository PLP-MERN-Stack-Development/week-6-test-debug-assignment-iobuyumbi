const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// GET all global (public) messages
router.get("/", async (req, res) => {
  const messages = await messageController.getAllMessages();
  res.json(messages);
});

module.exports = router;
