const express = require("express");
const { login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Login
router.post("/login", login);

// Protected Route (Testing)
router.get("/verify", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin Authorized",
        admin: req.user
    });
});

module.exports = router;