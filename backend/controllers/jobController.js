const supabase = require("../config/supabaseClient");

// Create or update job status
const upsertJob = async (req, res) => {
  const { quotation_id, status, notes } = req.body;

  if (!quotation_id || !status) {
    return res.status(400).json({ error: "quotation_id and status are required" });
  }

  if (!["not_started", "in_progress", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid job status" });
  }

  const timestamps = {};
  if (status === "in_progress") timestamps.started_at = new Date();
  if (status === "completed") timestamps.completed_at = new Date();

  const { data, error } = await supabase
    .from("jobs")
    .upsert([
      {
        quotation_id,
        status,
        notes,
        ...timestamps,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data[0]);
};

module.exports = {
  upsertJob,
};
