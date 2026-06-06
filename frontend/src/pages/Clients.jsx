import { useEffect, useState } from "react";
import { fetchClients, createClient } from "../api/clientsApi";

const EMPTY = { name: "", email: "", phone: "", address: "", requires_work_order: false };

export default function Clients() {
  const [clients, setClients]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [formData, setFormData]   = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm]   = useState(false);

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { alert("Client name is required"); return; }
    try {
      setSubmitting(true);
      const newClient = await createClient(formData);
      setClients(p => [newClient, ...p]);
      setFormData(EMPTY);
      setShowForm(false);
    } catch { alert("Failed to create client"); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-bar"><div className="spinner" /><span>Loading clients…</span></div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? "✕ Cancel" : "+ Add Client"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <div className="form-card-title">👤 New Client</div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group span2">
                <label className="form-label">Client Name *</label>
                <input className="form-input" name="name" placeholder="e.g. Acme Corp" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" type="email" placeholder="email@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group span2">
                <label className="form-label">Address</label>
                <input className="form-input" name="address" placeholder="Full address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="form-group span2">
                <div className="form-checkbox-group">
                  <input type="checkbox" id="rwo" name="requires_work_order" checked={formData.requires_work_order} onChange={handleChange} />
                  <label htmlFor="rwo">This client requires a Work Order before work begins</label>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button className="btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Save Client"}
              </button>
              <button className="btn-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <div className="table-card-header">
          <span className="table-card-title">All Clients</span>
          <span style={{ fontSize: 12, color: "var(--text-hint)" }}>{clients.length} total</span>
        </div>
        {clients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p>No clients yet. Add your first client above.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Work Order Required</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td style={{ color: "var(--text-muted)" }}>{c.email || "—"}</td>
                  <td style={{ color: "var(--text-muted)" }}>{c.phone || "—"}</td>
                  <td>
                    {c.requires_work_order
                      ? <span className="badge approved"><span className="badge-dot" />Yes</span>
                      : <span className="badge draft"><span className="badge-dot" />No</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}