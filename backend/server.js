const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store
let genders = [
  { id: 1, code: '1', gender_label: 'Male - ذكر', description: 'Male gender' },
  { id: 2, code: '2', gender_label: 'Female - أنثى', description: 'Female gender' }
];

let genderSelections = [];
let nextGenderId = 3;
let nextSelectionId = 1;

// ========== GENDERS CRUD ENDPOINTS ==========

// GET all genders
app.get("/api/genders", async (req, res) => {
  try {
    res.json(genders);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching genders", error: error.message });
  }
});

// GET single gender
app.get("/api/genders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const gender = genders.find(g => g.id == id);
    if (!gender) {
      return res.status(404).json({ message: "Gender not found" });
    }
    res.json(gender);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching gender", error: error.message });
  }
});

// POST - Create new gender
app.post("/api/genders", async (req, res) => {
  try {
    const { gender_label, description } = req.body;
    const code = req.body.code || (genders.length + 1).toString();

    if (!gender_label) {
      return res.status(400).json({ message: "Gender_label is required" });
    }

    const newGender = {
      id: nextGenderId++,
      code,
      gender_label,
      description: description || ""
    };

    genders.push(newGender);

    res.status(201).json({
      message: "Gender added successfully",
      gender: newGender,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error creating gender", error: error.message });
  }
});

// PUT - Update gender
app.put("/api/genders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { gender_label, description } = req.body;
    const code = req.body.code || genders.find(g => g.id == id)?.code;

    if (!gender_label) {
      return res.status(400).json({ message: "Gender_label is required" });
    }

    const genderIndex = genders.findIndex(g => g.id == id);
    if (genderIndex === -1) {
      return res.status(404).json({ message: "Gender not found" });
    }

    genders[genderIndex] = { ...genders[genderIndex], code, gender_label, description: description || "" };

    res.json({
      message: "Gender updated successfully",
      gender: genders[genderIndex],
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error updating gender", error: error.message });
  }
});

// DELETE - Delete gender
app.delete("/api/genders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const genderIndex = genders.findIndex(g => g.id == id);
    if (genderIndex === -1) {
      return res.status(404).json({ message: "Gender not found" });
    }

    const deletedGender = genders.splice(genderIndex, 1)[0];

    res.json({
      message: "Gender deleted successfully",
      gender: deletedGender,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error deleting gender", error: error.message });
  }
});

// ========== GENDER SELECTIONS CRUD ENDPOINTS ==========

// GET all selections
app.get("/api/gender-selections", async (req, res) => {
  try {
    const result = genderSelections.map(sel => {
      const gender = genders.find(g => g.id === sel.gender_id);
      return {
        id: sel.id,
        user_id: sel.user_id,
        code: gender ? gender.code : null,
        gender_label: gender ? gender.gender_label : null,
        description: gender ? gender.description : null,
        selected_at: sel.selected_at
      };
    }).sort((a, b) => new Date(b.selected_at) - new Date(a.selected_at));
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching selections", error: error.message });
  }
});

// POST - Add gender selection
app.post("/api/gender-selections", async (req, res) => {
  try {
    const { user_id, gender_id } = req.body;

    if (!user_id || !gender_id) {
      return res.status(400).json({ message: "user_id and gender_id are required" });
    }

    const newSelection = {
      id: nextSelectionId++,
      user_id,
      gender_id,
      selected_at: new Date().toISOString()
    };

    genderSelections.push(newSelection);

    res.status(201).json({
      message: "Selection added successfully",
      selection: newSelection,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error creating selection", error: error.message });
  }
});

// DELETE - Delete selection
app.delete("/api/gender-selections/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const selectionIndex = genderSelections.findIndex(s => s.id == id);
    if (selectionIndex === -1) {
      return res.status(404).json({ message: "Selection not found" });
    }

    const deletedSelection = genderSelections.splice(selectionIndex, 1)[0];

    res.json({
      message: "Selection deleted successfully",
      selection: deletedSelection,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error deleting selection", error: error.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Serve static files from frontend
app.use(express.static('../frontend'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});