const supabase = require("../config/supabaseClient");

// Create a new client
const createClient = async (req, res) => {
  const { name, email, phone, address, requires_work_order } = req.body;

  // Basic validation
  if (!name) {
    return res.status(400).json({ error: "Client name is required" });
  }

  const { data, error } = await supabase
    .from("clients")
    .insert([
      {
        name,
        email,
        phone,
        address,
        requires_work_order: requires_work_order || false,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
};
// Get all clients
const getAllClients = async (req, res) => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

module.exports = {
  createClient,
   getAllClients,
};

