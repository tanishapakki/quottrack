const supabase = require("../config/supabaseClient");

// Create quotation
const createQuotation = async (req, res) => {
  const {
    quotation_number,
    client_id,
    date,
    description,
    amount,
    status,
    work_started,
  } = req.body;

  // Validation
  if (!quotation_number || !client_id || !date || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase
    .from("quotations")
    .insert([
      {
        quotation_number,
        client_id,
        date,
        description,
        amount,
        status: status || "draft",
        work_started: work_started || false,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
};
// Update quotation approval
const updateQuotationApproval = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid approval status" });
  }

  const updateData = {
    status,
    approval_date: status === "approved" ? new Date() : null,
  };

  const { data, error } = await supabase
    .from("quotations")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data.length) {
    return res.status(404).json({ error: "Quotation not found" });
  }

  res.json(data[0]);
};

const getAllQuotations = async (req, res) => {
  const { data, error } = await supabase
    .from("quotations")
    .select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};


module.exports = {
  createQuotation,
  updateQuotationApproval,
  getAllQuotations,
};
