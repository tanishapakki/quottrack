import { useEffect, useState } from "react";
import { fetchQuotations, createQuotation } from "../api/quotationsApi";
import { fetchClients } from "../api/clientsApi";

const EMPTY = { quotation_number: "", client_id: "", date: "", description: "", amount: "", status: "sent", work_started: false };

const STATUS_ORDER = ["draft", "sent", "approved", "rejected"];

function StatusBadge({ status }) {
  return (
    <span className={`badge ${status}`}>
      <span className="badge-dot" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [clients, setClients]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [formData, setFormData]     = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    Promise.all([fetchQuotations(), fetchClients()])
      .then(([q, c]) => { setQuotations(q); setClients(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.quotation_number || !formData.client_id || !formData.amount) {
      alert("Quotation number, client, and amount are required");
      return;
    }
    try {
      setSubmitting(true);
      const newQ = await createQuotation(formData);
      setQuotations(p => [newQ, ...p]);
      setFormData(EMPTY);
      setShowForm(false);
    } catch { alert("Failed to create quotation"); }
    finally { setSubmitting(false); }
  };

  const filtered = filterStatus === "all" ? quotations : quotations.filter(q => q.status === filterStatus);

  const totalAmount = filtered.reduce((sum, q) => sum + Number(q.amount || 0), 0);

  if (loading) return <div className="loading-bar"><div className="spinner" /><span>Loading quotations…</span></div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? "✕ Cancel" : "+ New Quotation"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <div className="form-card-title">📋 New Quotation</div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Quotation Number *</label>
                <input className="form-input" name="quotation_number" placeholder="e.g. QT-2024-001" value={formData.quotation_number} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Client *</label>
                <select className="form-select" name="client_id" value={formData.client_id} onChange={handleChange}>
                  <option value="">Select client…</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" name="date" value={formData.date} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <input className="form-input" type="number" name="amount" placeholder="0.00" value={formData.amount} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                  {STATUS_ORDER.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ justifyContent: "flex-end" }}>
                <div className="form-checkbox-group" style={{ marginTop: "auto" }}>
                  <input type="checkbox" id="ws" name="work_started" checked={formData.work_started} onChange={handleChange} />
                  <label htmlFor="ws">Work already started</label>
                </div>
              </div>
              <div className="form-group span2">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" name="description" placeholder="Brief description of the work…" value={formData.description} onChange={handleChange} />
              </div>
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button className="btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Create Quotation"}
              </button>
              <button className="btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <div className="table-card-header">
          <span className="table-card-title">All Quotations</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <select
              className="form-select"
              style={{ padding: "5px 10px", fontSize: 12, width: "auto" }}
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">All statuses</option>
              {STATUS_ORDER.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <span style={{ fontSize: 12, color: "var(--text-hint)", whiteSpace: "nowrap" }}>
              {filtered.length} shown · ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No quotations found.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quotation #</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Work Started</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 500, fontFamily: "monospace", fontSize: 13 }}>{q.quotation_number}</td>
                    <td>{q.clients?.name || "—"}</td>
                    <td style={{ color: "var(--text-muted)" }}>{q.date || "—"}</td>
                    <td className="amount-cell">₹{Number(q.amount || 0).toLocaleString("en-IN")}</td>
                    <td><StatusBadge status={q.status || "draft"} /></td>
                    <td>
                      {q.work_started
                        ? <span className="badge sent"><span className="badge-dot" />Yes</span>
                        : <span className="badge draft"><span className="badge-dot" />No</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}