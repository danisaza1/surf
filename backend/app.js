
import express from "express";
import pool from "./src/db.js";


const port = 3002;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Bonjour, monde !");
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

// Exemple : ajouter un utilisateur
app.post("/users", async (req, res) => {
  const { prenom, nom, location, surf_level, utilisateur, email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (prenom,nom,location,surf_level,utilisateur,email, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [prenom, nom, location, surf_level, utilisateur, email, password]
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

// Exemple : ajouter un utilisateur
app.post("/dog", async (req, res) => {
  const { firstname, lastname, location, username, email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO dog (firstname, lastname, location, username,email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [firstname, lastname, location, username, email, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});






