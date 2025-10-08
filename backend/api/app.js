import express from "express";
import cors from "cors";
// Assurez-vous que tous vos chemins d'importation sont corrects pour les modules ES
import getRoutes from "../routes/get.js";
import authRoutes from "../routes/auth.js";
import geocodeRouter from "../routes/geocode.js";
import favoritesRoutes from "../routes/favorites.js";

const port = process.env.PORT || 3002;
const app = express();

// --- Configuration CORS Corrigée ---
// J'ai vérifié que vous avez bien le protocole HTTPS pour les domaines Vercel
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:3003",
  "https://surf-eight-puce.vercel.app", // Frontend Vercel (HTTPS)
  "https://surf-4cpv.vercel.app",       // Backend Vercel (HTTPS)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Si l'origine n'existe pas (requête directe ou locale), on autorise.
    // Sinon, on vérifie si elle est dans la liste autorisée.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// L'utilisation de `cors` doit venir APRES express.json()
app.use(cors(corsOptions));

// --- Routes ---
app.use("/", getRoutes);
app.use("/", authRoutes);

// Les routes avec le préfixe '/api'
app.use("/api", geocodeRouter);
app.use("/api", favoritesRoutes);

// --- Optimisation pour Vercel ---
// 1. Exporter l'application pour que Vercel puisse la lancer comme Serverless Function.
export default app;

// 2. Maintenir app.listen() UNIQUEMENT pour le développement local.
// La condition vérifie que nous ne sommes pas en production ou sur Vercel.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
  });
}