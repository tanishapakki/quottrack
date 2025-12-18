import { useEffect, useState } from "react";
import { fetchDashboardStats } from "./api/dashboardApi";
import StatCard from "./components/StatCard";
import Clients from "./pages/Clients";
import Quotations from "./pages/Quotations";

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchDashboardStats();
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Top Navigation */}
      <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("clients")} style={{ marginLeft: "10px" }}>
          Clients
        </button>
        <button onClick={() => setPage("quotations")} style={{ marginLeft: "10px" }}>
  Quotations
</button>
      </div>

      {/* Dashboard */}
      {page === "dashboard" && (
        <div style={{ padding: "20px" }}>
          <h1>QuotTrack Dashboard</h1>

          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <StatCard title="Total Quotations" value={stats.totalQuotations} />
            <StatCard title="Pending Approval" value={stats.pendingApproval} />
            <StatCard title="Approved Quotations" value={stats.approvedQuotations} />
            <StatCard title="Jobs In Progress" value={stats.jobsInProgress} />
            <StatCard title="Jobs Completed" value={stats.jobsCompleted} />

            <StatCard
              title="Work Without Approval"
              value={stats.workWithoutApproval}
              highlight={stats.workWithoutApproval > 0 ? "warning" : ""}
            />

            <StatCard
              title="Missing Compulsory WO"
              value={stats.missingCompulsoryWO}
              highlight={stats.missingCompulsoryWO > 0 ? "danger" : ""}
            />

            <StatCard
              title="Pending Payments"
              value={stats.pendingPayments}
              highlight={stats.pendingPayments > 0 ? "warning" : ""}
            />
          </div>
        </div>
      )}

      {page === "clients" && <Clients />}
      {page === "quotations" && <Quotations />}
    </div>
  );
}

export default App;
