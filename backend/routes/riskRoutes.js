const express = require("express");
const router = express.Router();
const { getMissingWorkOrders } = require("../controllers/riskController");

router.get("/missing-work-orders", getMissingWorkOrders);

module.exports = router;
