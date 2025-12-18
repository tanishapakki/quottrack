const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const supabase = require("./config/supabaseClient");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const clientRoutes = require("./routes/clientRoutes");
app.use("/api/clients", clientRoutes);

const quotationRoutes = require("./routes/quotationRoutes");
app.use("/api/quotations", quotationRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("QuotTrack API is running");
});

const workOrderRoutes = require("./routes/workOrderRoutes");
app.use("/api/work-orders", workOrderRoutes);

const riskRoutes = require("./routes/riskRoutes");
app.use("/api/risks", riskRoutes);

const jobRoutes = require("./routes/jobRoutes");
app.use("/api/jobs", jobRoutes);

const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/api/invoices", invoiceRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);


const PORT = process.env.PORT || 5000;
app.get("/db-test", async (req, res) => {
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
