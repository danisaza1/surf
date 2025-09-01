const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import express from "express";
// import pool from "./src/db.js";

const port = 3002;

app.get("/", (req, res) => {
  res.send("Bonjour, monde !");
});

app.get("/user", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM user");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

// Exemple : ajouter un utilisateur
app.post("/user", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (firstname, lastname, location, username,email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [firstname, lastname, location, username, email, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

app.get("/dog", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dog");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});






