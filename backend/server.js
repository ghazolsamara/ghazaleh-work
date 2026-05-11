const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// postgresql connection pool
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "genders_db",
  port: process.env.DB_PORT || 5432,
});

// ========== GENDERS CRUD ENDPOINTS ==========

// GET all genders
app.get("/api/genders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM genders ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error fetching genders", error: error.message });
  }
});

// GET single gender
app.get("/api/genders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM genders WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Gender not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error fetching gender", error: error.message });
  }
});

// POST - Create new gender
app.post("/api/genders", async (req, res) => {
  try {
    const { code, gender_label, description } = req.body;

    if (!code || !gender_label) {
      return res.status(400).json({ message: "Code and gender_label are required" });
    }

    const result = await pool.query(
      "INSERT INTO genders (code, gender_label, description) VALUES ($1, $2, $3) RETURNING *",
      [code, gender_label, description || ""]
    );

    res.status(201).json({
      message: "Gender added successfully",
      gender: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error creating gender", error: error.message });
  }
});

// PUT - Update gender
app.put("/api/genders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { code, gender_label, description } = req.body;

    if (!code || !gender_label) {
      return res.status(400).json({ message: "Code and gender_label are required" });
    }

    const result = await pool.query(
      "UPDATE genders SET code = $1, gender_label = $2, description = $3 WHERE id = $4 RETURNING *",
      [code, gender_label, description || "", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Gender not found" });
    }

    res.json({
      message: "Gender updated successfully",
      gender: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error updating gender", error: error.message });
  }
});

// DELETE - Delete gender
app.delete("/api/genders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM genders WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Gender not found" });
    }

    res.json({
      message: "Gender deleted successfully",
      gender: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error deleting gender", error: error.message });
  }
});

// ========== GENDER SELECTIONS CRUD ENDPOINTS ==========

// GET all selections
app.get("/api/gender-selections", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT gs.id, gs.user_id, g.code, g.gender_label, g.description, gs.selected_at FROM gender_selections gs JOIN genders g ON gs.gender_id = g.id ORDER BY gs.selected_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
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

    const result = await pool.query(
      "INSERT INTO gender_selections (user_id, gender_id) VALUES ($1, $2) RETURNING *",
      [user_id, gender_id]
    );

    res.status(201).json({
      message: "Selection added successfully",
      selection: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error creating selection", error: error.message });
  }
});

// DELETE - Delete selection
app.delete("/api/gender-selections/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM gender_selections WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Selection not found" });
    }

    res.json({
      message: "Selection deleted successfully",
      selection: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Error deleting selection", error: error.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

    return res.status(500).json({
      message: "Server error",
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});