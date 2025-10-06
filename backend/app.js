import express from "express";
import cors from "cors";
import getRoutes from "./routes/get.js";
// import postRoutes from "./routes/post.js";
import authRoutes from "./routes/auth.js";
import geocodeRouter from "./routes/geocode.js";
import favoritesRoutes from "./routes/favorites.js";
// REMOVIDO: import { updateProfile } from "./controllers/authController.js"; 

const port = 3002;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*", // ou "*" pour tout autoriser
}));

// Routes
app.use("/", getRoutes);
// app.use("/", postRoutes);
app.use("/", authRoutes);

// Las rutas de geocodificación, perfil (GET/PUT /profile) y favoritos (GET/POST/DELETE /favorites)
// están ahora bajo el prefijo '/api'.
app.use("/api", geocodeRouter);
app.use("/api", favoritesRoutes)
// REMOVIDO: app.put("/profile", updateProfile); 


app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
