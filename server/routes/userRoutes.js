const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET all online users
router.get("/", async (req, res) => {
  const users = await userController.getOnlineUsers();
  res.json(users);
});

module.exports = router;
