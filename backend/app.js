
import express from "express";
import cors from "cors";
import getRoutes from "./routes/get.js";
// import postRoutes from "./routes/post.js";
import authRoutes from "./routes/auth.js";
import geocodeRouter from "./routes/geocode.js";
import favoritesRoutes from "./routes/favorites.js";

const port = 3002;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*", // ou "*" pour tout autoriser
}));

// Routes GET
app.use("/", getRoutes);
// app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/api", geocodeRouter);
app.use("/api", favoritesRoutes)



app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});







