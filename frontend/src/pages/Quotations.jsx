import { useEffect, useState } from "react";
import { fetchQuotations, createQuotation  } from "../api/quotationsApi";
import { fetchClients } from "../api/clientsApi";
const [clients, setClients] = useState([]);
const [formData, setFormData] = useState({
  quotation_number: "",
  client_id: "",
  date: "",
  description: "",
  amount: "",
  status: "sent",
  work_started: false,
});
const [submitting, setSubmitting] = useState(false);

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.quotation_number || !formData.client_id || !formData.amount) {
    alert("Quotation number, client, and amount are required");
    return;
  }

  try {
    setSubmitting(true);
    const newQuotation = await createQuotation(formData);
    setQuotations((prev) => [newQuotation, ...prev]);

    setFormData({
      quotation_number: "",
      client_id: "",
      date: "",
      description: "",
      amount: "",
      status: "sent",
      work_started: false,
    });
  } catch (err) {
    alert("Failed to create quotation");
  } finally {
    setSubmitting(false);
  }
};
useEffect(() => {
  const loadData = async () => {
    try {
      const [qData, cData] = await Promise.all([
        fetchQuotations(),
        fetchClients(),
      ]);
      setQuotations(qData);
      setClients(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading quotations...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quotations</h1>
      <form
  onSubmit={handleSubmit}
  style={{
    marginTop: "20px",
    marginBottom: "30px",
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    maxWidth: "600px",
  }}
>
  <h3>Create Quotation</h3>

  <input
    name="quotation_number"
    placeholder="Quotation Number *"
    value={formData.quotation_number}
    onChange={handleChange}
    style={inputStyle}
  />

  <select
    name="client_id"
    value={formData.client_id}
    onChange={handleChange}
    style={inputStyle}
  >
    <option value="">Select Client *</option>
    {clients.map((client) => (
      <option key={client.id} value={client.id}>
        {client.name}
      </option>
    ))}
  </select>

  <input
    type="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    style={inputStyle}
  />

  <input
    name="amount"
    type="number"
    placeholder="Amount *"
    value={formData.amount}
    onChange={handleChange}
    style={inputStyle}
  />

  <textarea
    name="description"
    placeholder="Description"
    value={formData.description}
    onChange={handleChange}
    style={{ ...inputStyle, height: "80px" }}
  />

  <label style={{ display: "block", marginBottom: "10px" }}>
    <input
      type="checkbox"
      name="work_started"
      checked={formData.work_started}
      onChange={handleChange}
    />{" "}
    Work Started
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? "Saving..." : "Create Quotation"}
  </button>
</form>
      {quotations.length === 0 ? (
        <p>No quotations found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={thStyle}>Quotation No</th>
              <th style={thStyle}>Client</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Work Started</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q) => (
              <tr key={q.id}>
                <td style={tdStyle}>{q.quotation_number}</td>
                <td style={tdStyle}>{q.clients?.name}</td>
                <td style={tdStyle}>{q.date}</td>
                <td style={tdStyle}>{q.amount}</td>
                <td style={tdStyle}>{q.status}</td>
                <td style={tdStyle}>{q.work_started ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
};

const thStyle = {
  borderBottom: "1px solid #ccc",
  textAlign: "left",
  padding: "8px",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};

export default Quotations;
