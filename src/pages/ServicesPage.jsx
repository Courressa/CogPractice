import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3000/api/v1/customers";

function ServicesPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create form
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Create failed");
      alert(data.message);
      setForm({ username: "", password: "", firstName: "", lastName: "", email: "" });
      fetchCustomers();
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = (customer) => {
    setEditingId(customer.id);
    setEditForm({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
      username: customer.username || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      alert(data.message);
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      fetchCustomers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Services – Customer Management</h1>

      {/* ========== CREATE ========== */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h2>Create Customer</h2>
        <form onSubmit={handleCreate} style={{ display: "grid", gap: "0.6rem", maxWidth: 400 }}>
          <input placeholder="Username *" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input type="password" placeholder="Password *" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <input placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <button type="submit">Register</button>
        </form>
      </section>

      {/* ========== TABLE ========== */}
      <section>
        <h2>All Customers</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

        {!loading && !error && (
          <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6">No customers found</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>{c.id}</td>
                    <td>{c.username}</td>
                    <td>{c.firstName || "—"}</td>
                    <td>{c.lastName || "—"}</td>
                    <td>{c.email || "—"}</td>
                    <td>
                      <button onClick={() => startEdit(c)}>Edit</button>{" "}
                      <button onClick={() => handleDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* ========== EDIT FORM ========== */}
      {editingId && (
        <section style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #ccc", borderRadius: 8 }}>
          <h2>Edit Customer</h2>
          <form onSubmit={handleUpdate} style={{ display: "grid", gap: "0.6rem", maxWidth: 400 }}>
            <input placeholder="Username" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} />
            <input placeholder="First Name" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
            <input placeholder="Last Name" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
            <input type="email" placeholder="Email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default ServicesPage;