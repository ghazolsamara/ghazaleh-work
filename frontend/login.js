const API_URL = "http://localhost:5000/api";
let selectedRow = null;
let genders = [];

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadGenders();
  setupEventListeners();
});

// Setup event listeners for buttons
function setupEventListeners() {
  document.querySelector(".btn-add").addEventListener("click", addData);
  document.querySelector(".btn-edit").addEventListener("click", editData);
  document.querySelector(".btn-delete").addEventListener("click", deleteData);
  document.querySelector(".btn-cancel").addEventListener("click", cancelData);
}

// Load all genders from backend
async function loadGenders() {
  try {
    const response = await fetch(`${API_URL}/genders`);
    genders = await response.json();
    displayGenders();
  } catch (error) {
    console.error("Error loading genders:", error);
    alert("Failed to load genders");
  }
}

// Display genders in table
function displayGenders() {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  genders.forEach((gender) => {
    const row = tbody.insertRow();
    row.dataset.id = gender.id;
    row.innerHTML = `
      <td>${gender.code}</td>
      <td>${gender.gender_label}</td>
      <td>${gender.description}</td>
      <td class="row-actions">
        <span class="edit-action" onclick="selectRow(${gender.id})">✏️</span>
        <span class="delete-action" onclick="confirmDelete(${gender.id})">🗑️</span>
      </td>
    `;
    row.onclick = () => selectRow(gender.id);
  });
}

// Select row for editing
function selectRow(genderId) {
  const gender = genders.find((g) => g.id === genderId);
  if (gender) {
    document.getElementById("code").value = gender.code;
    document.getElementById("description").value = gender.description;
    document.querySelector("select").value = gender.gender_label.includes("Male") ? "Male" : "Female";
    selectedRow = genderId;
  }
}

// ADD new gender
async function addData() {
  const code = document.getElementById("code").value;
  const description = document.getElementById("description").value;
  const genderSelect = document.querySelector("select");
  const gender_label = genderSelect.value === "Male" ? "Male - ذكر" : "Female - أنثى";

  if (!code || !description) {
    alert("Please fill all fields");
    return;
  }

  if (code !== "1" && code !== "2") {
    alert("Invalid code! Use 1 for Male or 2 for Female");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/genders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, gender_label, description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    await loadGenders();
    clearFields();
  } catch (error) {
    console.error("Error adding gender:", error);
    alert("Failed to add gender: " + error.message);
  }
}

// EDIT existing gender
async function editData() {
  if (selectedRow === null) {
    alert("Select a row first");
    return;
  }

  const code = document.getElementById("code").value;
  const description = document.getElementById("description").value;
  const genderSelect = document.querySelector("select");
  const gender_label = genderSelect.value === "Male" ? "Male - ذكر" : "Female - أنثى";

  if (!code || !description) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/genders/${selectedRow}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, gender_label, description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    await loadGenders();
    clearFields();
  } catch (error) {
    console.error("Error updating gender:", error);
    alert("Failed to update gender: " + error.message);
  }
}

// DELETE gender
async function deleteData(genderId) {
  try {
    const response = await fetch(`${API_URL}/genders/${genderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    await loadGenders();
    clearFields();
  } catch (error) {
    console.error("Error deleting gender:", error);
    alert("Failed to delete gender: " + error.message);
  }
}

// Confirm before delete
function confirmDelete(genderId) {
  if (confirm("Are you sure you want to delete this gender?")) {
    deleteData(genderId);
  }
}

// CANCEL - Clear fields
function cancelData() {
  clearFields();
}

// CLEAR FIELDS
function clearFields() {
  document.getElementById("code").value = "";
  document.getElementById("description").value = "";
  document.querySelector("select").value = "Male";
  selectedRow = null;
}