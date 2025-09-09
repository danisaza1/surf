import express from "express";
import fetch from "node-fetch";

const router = express.Router();
router.use(express.json());

// Endpoint d'API pour le géocodage
router.get("/geocode", async (req, res) => {
  const { place } = req.query; // Récupère le paramètre 'place' de l'URL

  if (!place) {
    return res.status(400).json({ error: 'Le paramètre "place" est requis.' });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    place
  )},  France&format=json&limit=1`;

  console.log("Fetching from URL:", url);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Waveo/1.0 (contact@your-email.com)",
    },
  });

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Waveo/1.0 (contact@your-email.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const location = data[0];
      res.json({
        key: location.place_id.toString(),
        lat: parseFloat(location.lat),
        lon: parseFloat(location.lon),
        location: location.display_name,
        name : location.name
      });
    } else {
      res.status(404).json({ error: "Lieu non trouvé." });
    }
  } catch (error) {
    console.error(`Erreur de géocodage: ${error}`);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

export default router;
