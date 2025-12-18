const supabase = require("../config/supabaseClient");

// Add invoice reference
const addInvoice = async (req, res) => {
  const { quotation_id, invoice_number, invoice_date, payment_status } = req.body;

  if (!quotation_id || !invoice_number) {
    return res.status(400).json({ error: "quotation_id and invoice_number required" });
  }

  const { data, error } = await supabase
    .from("invoices")
    .upsert([
      {
        quotation_id,
        invoice_number,
        invoice_date,
        payment_status: payment_status || "pending",
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data[0]);
};

module.exports = {
  addInvoice,
};
