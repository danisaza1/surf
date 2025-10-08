import express from "express";
import cors from "cors";
import getRoutes from "./routes/get.js";
// import postRoutes from "./routes/post.js";
import authRoutes from "./routes/auth.js";
import geocodeRouter from "./routes/geocode.js";
import favoritesRoutes from "./routes/favorites.js";
// REMOVIDO: import { updateProfile } from "./controllers/authController.js"; 

const port = process.env.PORT || 3002;
const app = express();
const allowedOrigins = ["http://localhost:3000", "http://surf-eight-puce.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions)); 

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
