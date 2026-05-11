const express = require("express");
const postgresql = require("postgresql/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
};

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const connection = await postgresql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      "SELECT id, email FROM users WHERE email = ? AND password = ? LIMIT 1",
      [email, password]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.json({
      message: "Login successful",
      user: rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});