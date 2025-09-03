import express from "express";
import pool from "../src/db.js";

const router = express.Router();

router.post("/users", async (req, res) => {
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



// Exemple : ajouter un utilisateur
router.post("/dog", async (req, res) => {
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

export default router;