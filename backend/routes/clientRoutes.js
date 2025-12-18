const express = require("express");
const router = express.Router();
const { createClient,
    getAllClients,
 } = require("../controllers/clientController");

router.post("/", createClient);
router.get("/", getAllClients);


module.exports = router;
