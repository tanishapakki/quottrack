const supabase = require("../config/supabaseClient");

const getDashboardStats = async (req, res) => {
  try {
    // 1. Total quotations
    const { count: totalQuotations } = await supabase
      .from("quotations")
      .select("*", { count: "exact", head: true });

    // 2. Pending approval
    const { count: pendingApproval } = await supabase
      .from("quotations")
      .select("*", { count: "exact", head: true })
      .in("status", ["draft", "sent"]);

    // 3. Approved quotations
    const { count: approvedQuotations } = await supabase
      .from("quotations")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");

    // 4. Jobs in progress
    const { count: jobsInProgress } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress");

    // 5. Jobs completed
    const { count: jobsCompleted } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");

    // 6. Work started but approval missing
    const { data: workWithoutApproval } = await supabase
      .from("quotations")
      .select("id")
      .eq("work_started", true)
      .in("status", ["draft", "sent"]);

    // 7. Missing compulsory work orders
    const { data: riskyWO } = await supabase
      .from("quotations")
      .select(`
        id,
        clients ( requires_work_order ),
        work_orders ( received )
      `)
      .eq("work_started", true);

    const missingCompulsoryWO = riskyWO.filter(q =>
      q.clients?.requires_work_order === true &&
      (!q.work_orders || q.work_orders.received !== true)
    ).length;

    // 8. Pending payments
    const { count: pendingPayments } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "pending");

    res.json({
      totalQuotations,
      pendingApproval,
      approvedQuotations,
      jobsInProgress,
      jobsCompleted,
      workWithoutApproval: workWithoutApproval.length,
      missingCompulsoryWO,
      pendingPayments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardStats,
};
