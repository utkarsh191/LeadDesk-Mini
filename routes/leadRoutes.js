const express = require("express");
const router = express.Router();

const {
  createLead,
  getAllLeads,
  updateLeadStatus,
  searchLeads,
} = require("../controllers/leadController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", createLead);
router.get("/", getAllLeads);
router.get("/search", searchLeads);
router.put("/:id", updateLeadStatus);

module.exports = router;