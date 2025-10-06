import prisma from "../lib/prisma.js";
import express from "express";

const router = express.Router();
router.use(express.json());

// Middleware de autenticación simulado
// En un entorno de producción, esta función decodificaría el JWT,
// verificaría su validez y asignaría el ID real del payload a req.userId.
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Si no hay token Bearer, la autenticación falla
    return res.status(401).json({ error: "Authentification requise. Token 'Bearer' manquant." });
  }

  // --- SIMULACIÓN DE EXTRACCIÓN DE USER ID ---
  // Si el token está presente, asumimos que es válido y asignamos el ID mock (1) 
  // para mantener la funcionalidad con la base de datos simulada.
  // IMPORTANTE: REEMPLAZA ESTO CON LA LÓGICA DE VERIFICACIÓN REAL DEL TOKEN EN PRODUCCIÓN
  req.userId = 1; 
  // ------------------------------------------

  next();
};

// Aplicar el middleware a todas las rutas que requieren autenticación
router.use(authenticate);

// GET /profile → obtener el perfil del usuario autenticado
router.get("/profile", async (req, res) => {
  const userId = req.userId; // ID obtenido del middleware
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true }, 
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    // Mapeamos los campos del backend al formato del frontend antes de devolver
    const userForFrontend = {
        ...user,
        username: user.username,
        location: user.location,
        surf_level: user.surf_level,
    };

    return res.status(200).json(userForFrontend);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno al obtener el perfil" });
  }
});


// PUT /profile → actualizar el perfil del usuario Y eliminar favoritos
router.put("/profile", async (req, res) => {
  // Ahora usamos el ID del request, establecido por el middleware
  const userId = req.userId; 
  
  // Los campos que vienen del frontend (mapeados por el frontend)
  const { 
    username, 
    password, 
    email, 
    prenom, 
    nom, 
    location, 
    surf_level, 
    removedFavorites // Nuevo campo para los IDs de spots a eliminar
  } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // 1. Manejar la eliminación de favoritos si la lista no está vacía
    if (removedFavorites && removedFavorites.length > 0) {
      // Buscar los IDs internos (DB) de los FavoriteSpot a partir de los api_place_id
      const spotsToDisconnect = await prisma.favoriteSpot.findMany({
        where: { 
          api_place_id: { 
            in: removedFavorites 
          } 
        },
        select: { id: true },
      });
      
      const disconnectIds = spotsToDisconnect.map(spot => ({ id: spot.id }));

      if (disconnectIds.length > 0) {
        // Desconectar los spots del usuario
        await prisma.user.update({
          where: { id: userId },
          data: {
            favorites: { disconnect: disconnectIds },
          },
        });
      }
    }

    // 2. Actualizar el perfil del usuario con los nuevos datos
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        password,
        email,
        prenom,
        nom,
        location,
        surf_level,
      },
      // Incluimos los nuevos favoritos (los que no se desconectaron) para devolver el estado completo
      include: { favorites: true }, 
    });
    
    // Mapeamos los campos del backend al formato del frontend antes de devolver
    const userForFrontend = {
        ...updatedUser,
        username: updatedUser.username,
        location: updatedUser.location,
        surf_level: updatedUser.surf_level,
    };
    
    return res.status(200).json(userForFrontend);
    
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error interno al actualizar el perfil" });
  }
});

// GET /favorites → obtener favoritos del usuario 
router.get("/favorites", async (req, res) => {
  const userId = req.userId; // ID obtenido del middleware
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
  const userId = req.userId; // ID obtenido del middleware
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
  const userId = req.userId; // ID obtenido del middleware
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
