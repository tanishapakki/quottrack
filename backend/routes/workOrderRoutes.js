const express = require("express");
const router = express.Router();
const { upsertWorkOrder } = require("../controllers/workOrderController");

router.post("/", upsertWorkOrder);

module.exports = router;
