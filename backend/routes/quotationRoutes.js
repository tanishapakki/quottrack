const express = require("express");
const router = express.Router();
const { createQuotation,
  updateQuotationApproval, getAllQuotations } = require("../controllers/quotationController");

router.get("/", getAllQuotations);
router.post("/", createQuotation);
router.patch("/:id/approval", updateQuotationApproval);

module.exports = router;
