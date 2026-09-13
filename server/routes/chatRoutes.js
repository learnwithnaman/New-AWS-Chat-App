const express = require("express");
const router = express.Router();

// Lightweight REST endpoint — mainly so /api keeps responding to plain HTTP
// checks (e.g. curl, uptime monitors) alongside the Socket.IO connection.
router.get("/status", (req, res) => {
  res.json({ status: "OK", message: "Chat API is running" });
});

module.exports = router;
