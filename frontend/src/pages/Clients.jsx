import { useEffect, useState } from "react";
import { fetchClients, createClient } from "../api/clientsApi";
function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  address: "",
  requires_work_order: false,
});

const [submitting, setSubmitting] = useState(false);
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    alert("Client name is required");
    return;
  }

  try {
    setSubmitting(true);
    const newClient = await createClient(formData);
    setClients((prev) => [newClient, ...prev]);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      requires_work_order: false,
    });
  } catch (err) {
    alert("Failed to create client");
  } finally {
    setSubmitting(false);
  }
};

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients();
        setClients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading clients...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Clients</h1>

      <form
  onSubmit={handleSubmit}
  style={{
    marginTop: "20px",
    marginBottom: "30px",
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    maxWidth: "500px",
  }}
>
  <h3>Add New Client</h3>

  <input
    name="name"
    placeholder="Client Name *"
    value={formData.name}
    onChange={handleChange}
    style={inputStyle}
  />

  <input
    name="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
    style={inputStyle}
  />

  <input
    name="phone"
    placeholder="Phone"
    value={formData.phone}
    onChange={handleChange}
    style={inputStyle}
  />

  <input
    name="address"
    placeholder="Address"
    value={formData.address}
    onChange={handleChange}
    style={inputStyle}
  />

  <label style={{ display: "block", marginBottom: "10px" }}>
    <input
      type="checkbox"
      name="requires_work_order"
      checked={formData.requires_work_order}
      onChange={handleChange}
    />{" "}
    Requires Work Order
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? "Saving..." : "Add Client"}
  </button>
</form>

      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Requires WO</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td style={tdStyle}>{client.name}</td>
                <td style={tdStyle}>{client.email || "-"}</td>
                <td style={tdStyle}>{client.phone || "-"}</td>
                <td style={tdStyle}>
                  {client.requires_work_order ? "Yes" : "No"}
                </td>
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

export default Clients;
