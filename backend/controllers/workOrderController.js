const supabase = require("../config/supabaseClient");

// Create or update work order
const upsertWorkOrder = async (req, res) => {
  const { quotation_id, received, work_order_number, received_date } = req.body;

  if (!quotation_id) {
    return res.status(400).json({ error: "quotation_id is required" });
  }

  const { data, error } = await supabase
    .from("work_orders")
    .upsert([
      {
        quotation_id,
        received: received || false,
        work_order_number,
        received_date,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data[0]);
};

module.exports = {
  upsertWorkOrder,
};
