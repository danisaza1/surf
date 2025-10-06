import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "patron";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refreshtoken_secret";

// Génère un token JWT
const generateAccessToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      prenom: user.prenom,
      nom: user.nom,
      location: user.location,
      surf_level: user.surf_level,
      username: user.username,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

const generateRefreshToken = (user) =>
  jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

// ======================== SIGNUP ========================
export const signup = async (req, res) => {
  const { prenom, nom, location, surf_level, username, email, password } = req.body;

  if (!prenom || !nom || !location || !surf_level || !username || !email || !password) {
    return res.status(400).json({ error: "Champs requis manquants." });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email déjà utilisé." });

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        prenom,
        nom,
        location,
        surf_level,
        username,
        email,
        password: passwordHash,
        role: "USER",
      },
    });

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// ======================== CHANGE PASSWORD ========================
export const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword)
    return res.status(400).json({ error: "Champs requis manquants." });

  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        password: true 
      }
    });
    
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: newHashedPassword }, 
      select: {
        id: true,
        email: true,
        password: true 
      }
    });

    res.json({ message: "Mot de passe mis à jour avec succès.", success: true  });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// ======================== LOGIN ========================
export const login = async (req, res) => {
    console.log("coucou login")
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Mot de passe incorrect." });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // ⚠️ mettre à true en prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        location: user.location,
        surf_level: user.surf_level,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// ======================== REFRESH TOKEN ========================
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: "Token manquant." });

    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        location: user.location,
        surf_level: user.surf_level,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(403).json({ error: "Token invalide ou expiré." });
  }
};

// ======================== LOGOUT ========================
export const logout = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict", secure: false });
  res.status(200).json({ message: "Déconnecté avec succès." });
};

// ======================== GET LATEST USER ========================
export const getLatestUser = async (req, res) => {
  try {
    const latestUser = await prisma.user.findFirst({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        nom: true,
        prenom: true,
        location: true,
        surf_level: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!latestUser) return res.status(404).json({ erreur: "Données non trouvées !" });

    res.json(latestUser);
  } catch (error) {
    console.error("Erreur récupération dernier utilisateur :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// ======================== GET PROFILE ========================
export const getProfile = async (req, res) => {
  console.log('Récupération du profil utilisateur...');
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if (!accessToken) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        prenom: true,
        nom: true,
        location: true,
        surf_level: true,
        username: true,
        email: true,
        role: true,
      },
    });

    if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

    res.json({
      id: user.id,
      prenom: user.prenom,
      nom: user.nom,
      location: user.location,
      surf_level: user.surf_level,
      username: user.username,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// ======================== CHANGE PROFILE (UPDATE) ========================
export const changeProfile = async (req, res) => {
  // Vérifier l'authentification
  if (!req.user || !req.user.id) {
     return res.status(401).json({ error: "Non autorisé: ID utilisateur manquant." });
  }
  const userId = req.user.id; 

  // CORRECTION: Le frontend envoie 'location' et 'surf'
  const { prenom, nom, location, surf, username, email, password, removedFavorites } = req.body;

  // Log pour debugging
  console.log("Données reçues:", { prenom, nom, location, surf, username, email, hasPassword: !!password, removedFavorites });

  // Vérification des champs obligatoires (password est optionnel)
  if (!prenom || !nom || !location || !surf || !username || !email) {
    return res.status(400).json({ 
      error: "Champs requis manquants.",
      received: { prenom: !!prenom, nom: !!nom, location: !!location, surf: !!surf, username: !!username, email: !!email }
    });
  }

  try {
    // 1. Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      return res.status(409).json({ error: "Email déjà utilisé par un autre utilisateur." });
    }

    // 2. Préparer les données de mise à jour
    // IMPORTANT: Utiliser les noms de champs EXACTS de Prisma
    const updateData = {
      prenom,
      nom,
      location: location,         // Champ DB: 'location'
      surf_level: surf,           // Champ DB: 'surf_level' (pas 'surf')
      username: username,         // Champ DB: 'username' (pas 'utilisateur')
      email,
    };

    // 3. Hash du mot de passe si fourni
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
      console.log("Mot de passe mis à jour");
    }
    
    // 4. Supprimer les favoris si présents dans le payload
    if (removedFavorites && Array.isArray(removedFavorites) && removedFavorites.length > 0) {
      console.log("Suppression de favoris:", removedFavorites);
      await prisma.favoriteSpot.deleteMany({
        where: {
          user_id: userId,
          api_place_id: {
            in: removedFavorites,
          },
        },
      });
    }

    // 5. Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        prenom: true,
        nom: true,
        location: true,
        surf_level: true,
        username: true,
        email: true,
        role: true,
      },
    });

    console.log("Profil mis à jour avec succès:", updatedUser.username);

    // 6. Retourner l'utilisateur mis à jour
    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      error: "Erreur serveur lors de la mise à jour du profil.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}


// ======================== UPDATE PROFILE (DEPRECATED/UNUSED IN THIS CONTEXT) ========================

export const updateProfile = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const userId = decoded.id;

    const { username, location, surf_level } = req.body;
    if (!username || !location || !surf_level) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, location, surf_level },
      select: { id: true, username: true, location: true, surf_level: true, email: true },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
