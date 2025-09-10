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
        password: true  // ← CORRECTION: "password" au lieu de "passwordHash"
      }
    });
    
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: newHashedPassword }, // ← CORRECTION: "password" au lieu de "passwordHash"
      select: {
        id: true,
        email: true,
        password: true  // ← CORRECTION: "password" au lieu de "passwordHash"
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
      adresse: user.location,
      surf: user.surf_level,
      utilisateur: user.username,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

export const changeProfile = async (req, res) => {
  const userId = req.user.id; // récupéré via le token JWT middleware
  const { prenom, nom, adresse, surf, utilisateur, email, password } = req.body;

  if (!prenom || !nom || !adresse || !surf || !utilisateur || !email)
    return res.status(400).json({ error: "Champs requis manquants." });

  try {
    // Vérifie si l'email est déjà utilisé par un autre utilisateur
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId)
      return res.status(409).json({ error: "Email déjà utilisé." });

    // Prépare les données à mettre à jour
    const updateData = {
      prenom,
      nom,
      location: adresse,
      surf_level: surf,
      username: utilisateur,
      email,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({ message: "Modifications réussies !" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};


// ======================== UPDATE PROFILE ========================

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