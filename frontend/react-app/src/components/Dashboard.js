import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [genders, setGenders] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({ gender: 'Male', description: '' });

  useEffect(() => {
    loadGenders();
  }, []);

  const loadGenders = async () => {
    try {
      const response = await axios.get(`${API_URL}/genders`);
      setGenders(response.data);
    } catch (error) {
      console.error('Error loading genders:', error);
      alert('Failed to load genders');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const clearFields = () => {
    setFormData({ gender: 'Male', description: '' });
    setSelectedRow(null);
  };

  const showAddForm = () => {
    setIsEditMode(false);
    setIsFormVisible(true);
    clearFields();
  };

  const editData = () => {
    if (selectedRow === null) {
      alert('Select a row first');
      return;
    }
    setIsEditMode(true);
    setIsFormVisible(true);
  };

  const saveAddData = async () => {
    const genderLabel = formData.gender === 'Male' ? 'Male - ذكر' : 'Female - أنثى';
    if (!formData.description) {
      alert('Please fill the description');
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/genders/${selectedRow}`, {
          gender_label: genderLabel,
          description: formData.description
        });
      } else {
        await axios.post(`${API_URL}/genders`, {
          gender_label: genderLabel,
          description: formData.description
        });
      }
      await loadGenders();
      clearFields();
      setIsEditMode(false);
      setIsFormVisible(false);
      alert(`Gender ${isEditMode ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving gender:', error);
      alert('Failed to save gender');
    }
  };

  const deleteSelectedRow = () => {
    if (selectedRow === null) {
      alert('Please select a row to delete');
      return;
    }
    const confirmDialog = window['confirm'];
    if (confirmDialog('Are you sure you want to delete this gender?')) {
      deleteData(selectedRow);
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`${API_URL}/genders/${id}`);
      await loadGenders();
      clearFields();
      setIsFormVisible(false);
      alert('Gender deleted successfully!');
    } catch (error) {
      console.error('Error deleting gender:', error);
      alert('Failed to delete gender');
    }
  };

  const selectRow = (id) => {
    const gender = genders.find(g => g.id === id);
    if (gender) {
      setFormData({
        gender: gender.gender_label.includes('Male') ? 'Male' : 'Female',
        description: gender.description
      });
      setSelectedRow(id);
    }
  };

  const cancelData = () => {
    setIsEditMode(false);
    setIsFormVisible(false);
    clearFields();
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-left">
          <h2>🏳️ Gender Management System</h2>
        </div>
        <div className="nav-right">
          <span className="user-info">👤 {user?.username}</span>
          <button onClick={handleLogout} className="btn-logout">🚪 Logout</button>
        </div>
      </div>

      <div className="main-card">
        <div className="main-title">
          <h1>🏳️ Gender Management</h1>
        </div>

        {isFormVisible && (
          <div className="form-grid">
            <div className="input-field">
              <label>⚧ Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="input-field">
              <label>📝 Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
          </div>
        )}

        <div className="actions-bar">
          <button className="btn btn-add" onClick={showAddForm}>➕ Add</button>
          <button className="btn btn-edit" onClick={editData}>✏️ Edit</button>
          {isFormVisible && (
            <>
              <button className="btn btn-save" onClick={saveAddData}>💾 Save</button>
              <button className="btn btn-cancel" onClick={cancelData}>❌ Cancel</button>
            </>
          )}
          <button className="btn btn-delete" onClick={deleteSelectedRow}>🗑️ Delete</button>
        </div>

        <div className="table-header">
          <h3>📋 Gender List</h3>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Gender</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {genders.map((gender) => (
                <tr key={gender.id} onClick={() => selectRow(gender.id)}>
                  <td>{gender.gender_label}</td>
                  <td>{gender.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;