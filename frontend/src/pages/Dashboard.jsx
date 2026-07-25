import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/leads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeads(res.data.leads);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addLead = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post("/leads", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
      });

      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

    const searchLead = async (value) => {
    setSearch(value);

    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/leads/search?search=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeads(res.data.leads);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/leads/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLeads();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="dashboard">

      <div className="topbar">
        <h1>Lead Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <form onSubmit={addLead} className="lead-form">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Lead</button>
      </form>

      <input
        className="search"
        placeholder="Search by Name, Email or Company..."
        value={search}
        onChange={(e) => searchLead(e.target.value)}
      />

      <h3>Total Leads : {leads.length}</h3>

            <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>{lead.company}</td>

                <td>
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateStatus(lead._id, e.target.value)
                    }
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No Leads Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default Dashboard;