const supabase = require("../config/supabaseClient");

// Get jobs missing compulsory work orders
const getMissingWorkOrders = async (req, res) => {
  const { data, error } = await supabase
    .from("quotations")
    .select(`
      id,
      quotation_number,
      work_started,
      clients (
        name,
        requires_work_order
      ),
      work_orders (
        received
      )
    `)
    .eq("work_started", true);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const risky = data.filter(q =>
    q.clients?.requires_work_order === true &&
    (!q.work_orders || q.work_orders.received !== true)
  );

  res.json(risky);
};

module.exports = {
  getMissingWorkOrders,
};
