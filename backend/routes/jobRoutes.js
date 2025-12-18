const express = require("express");
const router = express.Router();
const { upsertJob } = require("../controllers/jobController");

router.post("/", upsertJob);

module.exports = router;
