const express = require("express");
const router = express.Router();
const { addInvoice } = require("../controllers/invoiceController");

router.post("/", addInvoice);

module.exports = router;
