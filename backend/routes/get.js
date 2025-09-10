import express from "express";
import pool from "../src/db.js";

const router = express.Router();

// Route GET /
router.get("/", (req, res) => {
  res.send("Bonjour, monde !");
});





export default router;


