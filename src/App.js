import React, { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [cases, setCases] = useState([]);
  const [formData, setFormData] = useState({
    caseTitle: '',
    description: '',
    defenderName: '',
    offenderName: '',
    caseType: 'NORMAL',
    status: 'OPEN'
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch cases
  useEffect(() => {
    fetch('http://localhost:8080/api/cases')
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Submit new or updated case
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing case
      fetch(`http://localhost:8080/api/cases/${editingId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(updatedCase => {
        setCases(cases.map(c => c.id === editingId ? updatedCase : c));
        setEditingId(null);
        resetForm();
      })
      .catch(err => console.error("Update error:", err));
    } else {
      // Create new case
      fetch('http://localhost:8080/api/cases', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(newCase => {
        setCases([...cases, newCase]);
        resetForm();
      })
      .catch(err => console.error("Create error:", err));
    }
  };

  // Delete case
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/cases/${id}`, {
      method: 'DELETE'
    })
    .then(() => setCases(cases.filter(c => c.id !== id)))
    .catch(err => console.error("Delete error:", err));
  };

  // Edit case
  const handleEdit = (c) => {
    setFormData({
      caseTitle: c.caseTitle,
      description: c.description,
      defenderName: c.defenderName,
      offenderName: c.offenderName,
      caseType: c.caseType,
      status: c.status
    });
    setEditingId(c.id);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      caseTitle: '',
      description: '',
      defenderName: '',
      offenderName: '',
      caseType: 'NORMAL',
      status: 'OPEN'
    });
  };

  return (
    <div className="container">
      <h1>Court Case Management</h1>

      <form onSubmit={handleSubmit}>
        <input name="caseTitle" placeholder="Case Title" value={formData.caseTitle} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
        <input name="defenderName" placeholder="Defender Name" value={formData.defenderName} onChange={handleChange} />
        <input name="offenderName" placeholder="Offender Name" value={formData.offenderName} onChange={handleChange} />
        <select name="caseType" value={formData.caseType} onChange={handleChange}>
          <option value="NORMAL">Normal</option>
          <option value="CRIMINAL">Criminal</option>
        </select>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button type="submit">{editingId ? "Update Case" : "Add Case"}</button>
      </form>

      <div className="case-list">
        <h2>All Cases</h2>
        {cases.map(c => (
          <div key={c.id} className="case-card">
            <div className="case-title">{c.caseTitle}</div>
            <div className="case-meta">
              Type: {c.caseType} | Status: {c.status}<br/>
              Defender: {c.defenderName} | Offender: {c.offenderName}
            </div>
            <p>{c.description}</p>
            <div className="case-actions">
              <button onClick={() => handleEdit(c)}>Edit</button>
              <button onClick={() => handleDelete(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;