import express from "express";
import pool from "../src/db.js";

const router = express.Router();

// Route GET /
router.get("/", (req, res) => {
  res.send("Bonjour, monde !");
});

// Route GET /users
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

// Route GET /dog
router.get("/dog", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dog");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

export default router;


