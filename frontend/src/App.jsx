import { useEffect, useState } from "react";
import { fetchDashboardStats } from "./api/dashboardApi";
import Clients from "./pages/Clients";
import Quotations from "./pages/Quotations";
import "./App.css";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "quotations", label: "Quotations", icon: "📋" },
  { id: "clients", label: "Clients", icon: "👥" },
];

function StatCard({ title, value, highlight }) {
  return (
    <div className={`stat-card ${highlight || ""}`}>
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value ?? "—"}</div>
    </div>
  );
}

function Dashboard({ stats, loading }) {
  if (loading) return <div className="loading-bar"><div className="spinner" /><span>Loading stats…</span></div>;

  return (
    <div>
      {stats?.workWithoutApproval > 0 && (
        <div className="alert-bar">
          ⚠️ <strong>{stats.workWithoutApproval}</strong> job(s) started without approval
        </div>
      )}
      {stats?.missingCompulsoryWO > 0 && (
        <div className="alert-bar danger">
          🚨 <strong>{stats.missingCompulsoryWO}</strong> missing compulsory work order(s)
        </div>
      )}

      <div className="stats-grid">
        <StatCard title="Total Quotations"    value={stats?.totalQuotations} />
        <StatCard title="Pending Approval"    value={stats?.pendingApproval} />
        <StatCard title="Approved"            value={stats?.approvedQuotations} />
        <StatCard title="Jobs In Progress"    value={stats?.jobsInProgress} />
        <StatCard title="Jobs Completed"      value={stats?.jobsCompleted} />
        <StatCard title="Pending Payments"    value={stats?.pendingPayments}    highlight={stats?.pendingPayments  > 0 ? "warning" : ""} />
        <StatCard title="Work w/o Approval"   value={stats?.workWithoutApproval} highlight={stats?.workWithoutApproval > 0 ? "warning" : ""} />
        <StatCard title="Missing Compulsory WO" value={stats?.missingCompulsoryWO} highlight={stats?.missingCompulsoryWO > 0 ? "danger" : ""} />
      </div>

      <div style={{ color: "var(--text-hint)", fontSize: 12, marginTop: 8 }}>
        Last refreshed: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}

export default function App() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .finally(() => setStatsLoading(false));
  }, []);

  const pageLabels = { dashboard: "Dashboard", quotations: "Quotations", clients: "Clients" };
  const pageSubtitles = {
    dashboard: "Overview of your quotation activity",
    quotations: "Manage and track all quotations",
    clients: "Manage client records",
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">Q</div>
            <span className="logo-text">Quot<span>Track</span></span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">QuotTrack v1.0</div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <div className="page-title">{pageLabels[page]}</div>
            <div className="page-subtitle">{pageSubtitles[page]}</div>
          </div>
        </header>

        <div className="page-body">
          {page === "dashboard"   && <Dashboard stats={stats} loading={statsLoading} />}
          {page === "clients"     && <Clients />}
          {page === "quotations"  && <Quotations />}
        </div>
      </main>
    </div>
  );
}