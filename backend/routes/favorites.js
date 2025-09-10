import prisma from "../lib/prisma.js";
import express from "express";

const router = express.Router();
router.use(express.json());

// TODO: REMPLACER PAR LE userId DE L'UTILISATEUR CONNECTÉ
const userId = 1;

// PUT /profile → actualizar el perfil del usuario
router.put("/profile", async (req, res) => {
  const { utilisateur, password, email, prenom, nom, localisation, surf } =
    req.body;

  try {
    // We check if the user exists before attempting to update them.
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        utilisateur,
        password,
        email,
        prenom,
        nom,
        localisation,
        surf,
      },
    });
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error interno al actualizar el perfil" });
  }
});

// GET /favorites → obtener favoritos del usuario
router.get("/favorites", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true },
    });
    return res.status(200).json(user?.favorites || []);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno" });
  }
});

// POST /favorites → agregar un nuevo favorito
router.post("/favorites", async (req, res) => {
  const { place_id, name, latitude, longitude } = req.body;
  if (!place_id) return res.status(400).json({ error: "Falta place_id" });

  try {
    // Buscar o crear el spot en la DB
    let favoriteSpot = await prisma.favoriteSpot.findUnique({
      where: { api_place_id: place_id },
    });

    if (!favoriteSpot) {
      favoriteSpot = await prisma.favoriteSpot.create({
        data: {
          api_place_id: place_id,
          name,
          latitude,
          longitude,
        },
      });
    } // Agregarlo a los favoritos del usuario

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: { connect: { id: favoriteSpot.id } },
      },
      include: { favorites: true },
    });

    return res.status(200).json(updatedUser.favorites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno" });
  }
});

// DELETE /favorites → quitar favorito
router.delete("/favorites", async (req, res) => {
  const { place_id } = req.body;
  if (!place_id) return res.status(400).json({ error: "Falta place_id" });

  try {
    // Buscar el spot para obtener su ID
    const favoriteSpot = await prisma.favoriteSpot.findUnique({
      where: { api_place_id: place_id },
    });

    if (!favoriteSpot)
      return res.status(404).json({ error: "Spot no encontrado" }); // Desconectar el spot de los favoritos del usuario

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { favorites: { disconnect: { id: favoriteSpot.id } } },
      include: { favorites: true },
    });

    return res.status(200).json(updatedUser.favorites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno" });
  }
});

export default router;
