const API_URL = "http://localhost:3000/api";
let selectedRow = null;
let genders = [];
let isEditMode = false;

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadGenders();
  setupEventListeners();
  disableAllFields();
});

// Disable all input fields
function disableAllFields() {
  document.getElementById("description").disabled = true;
  document.getElementById("gender").disabled = true;
}

// Enable all input fields
function enableAllFields() {
  document.getElementById("description").disabled = false;
  document.getElementById("gender").disabled = false;
}

// Setup event listeners for buttons
function setupEventListeners() {
  document.querySelector(".btn-add").addEventListener("click", showAddForm);
  document.querySelector(".btn-edit").addEventListener("click", editData);
  document.querySelector(".btn-save").addEventListener("click", saveAddData);
  document.querySelector(".btn-delete").addEventListener("click", deleteSelectedRow);
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
    document.getElementById("description").value = gender.description;
    document.getElementById("gender").value = gender.gender_label.includes("Male") ? "Male" : "Female";
    selectedRow = genderId;
  }
}

// Show Add Form
function showAddForm() {
  isEditMode = false;
  clearFields();
  enableAllFields();
}

// Save Add Data
async function saveAddData() {
  if (isEditMode) {
    await updateEditedData();
    return;
  }

  const description = document.getElementById("description").value;
  const genderSelect = document.getElementById("gender");
  const gender_label = genderSelect.value === "Male" ? "Male - ذكر" : "Female - أنثى";

  if (!description) {
    alert("Please fill the description");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/genders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gender_label, description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    await loadGenders();
    clearFields();
    isEditMode = false;
    disableAllFields();
    alert("Gender added successfully!");
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
  isEditMode = true;
  enableAllFields();
}

// UPDATE edited data
async function updateEditedData() {
  if (selectedRow === null) {
    alert("Select a row first");
    return;
  }

  const description = document.getElementById("description").value;
  const genderSelect = document.getElementById("gender");
  const gender_label = genderSelect.value === "Male" ? "Male - ذكر" : "Female - أنثى";

  if (!description) {
    alert("Please fill the description");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/genders/${selectedRow}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gender_label, description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    await loadGenders();
    clearFields();
    isEditMode = false;
    disableAllFields();
    alert("Gender updated successfully!");
  } catch (error) {
    console.error("Error updating gender:", error);
    alert("Failed to update gender: " + error.message);
  }
}

// SAVE description
async function saveData() {
  if (selectedRow === null) {
    alert("Select a row first");
    return;
  }

  const description = document.getElementById("description").value;

  try {
    const gender = genders.find(g => g.id === selectedRow);
    const response = await fetch(`${API_URL}/genders/${selectedRow}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gender_label: gender.gender_label, description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    await loadGenders();
    clearFields();
    disableAllFields();
    alert("Description saved successfully!");
  } catch (error) {
    console.error("Error saving description:", error);
    alert("Failed to save description: " + error.message);
  }
}

// DELETE selected row
async function deleteSelectedRow() {
  if (selectedRow === null) {
    alert("Please select a row to delete");
    return;
  }
  confirmDelete(selectedRow);
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
    disableAllFields();
    alert("Gender deleted successfully!");
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
  isEditMode = false;
  clearFields();
  disableAllFields();
}


// CLEAR FIELDS
function clearFields() {
  document.getElementById("description").value = "";
  document.getElementById("gender").value = "Male";
  selectedRow = null;
  disableAllFields();
}