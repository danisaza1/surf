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
      adresse: user.location,
      surf: user.surf_level,
      utilisateur: user.username,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );


const generateRefreshToken = (user) =>
  jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

// Inscription
export const signup = async (req, res) => {
  const {prenom, nom, adresse, surf, utilisateur, email, password } = req.body;

  if (!prenom || !nom || !adresse || !surf || !utilisateur || !email || !password)
    return res.status(400).json({ error: "Champs requis manquants." });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(409).json({ error: "Email déjà utilisé." });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { prenom, 
        nom,
        location: adresse, 
        surf_level: surf,
        username: utilisateur,
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

// Changement de mot de passe
export const changePassword = async (req, res) => {
  const { email,  newPassword } = req.body;

  if (!email ||  !newPassword)
    return res.status(400).json({ error: "Champs requis manquants." });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable." });

    // const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    // if (!valid)
    //   return res.status(401).json({ error: "Mot de passe actuel incorrect." });

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: newHashedPassword },
    });

    res.json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};




// Connexion
export const login = async (req, res) => {
  console.log("coucou login")
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Mot de passe incorrect." });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Backend - route pour récupérer le profil utilisateur authentifié
    
    // 🍪 Stocker le refreshToken dans le cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // à mettre sur true en prod (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        adresse: user.location,
        surf: user.surf_level,
        utilisateur: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res.status(401).json({ error: "Token manquant." });

    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable." });

    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        prenom: user.prenom,
        nom: user.nom,
        adresse: user.adresse,
        surf: user.surf,
        utilisateur: user.utilisateur,
        email: user.email,
        role: user.role,
      },
    });
   } catch (error) {
    console.error("Refresh error:", error);
    res.status(403).json({ error: "Token invalide ou expiré." });
  }
};

// Déconnexion
export const logout = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict", secure: false });
  res.status(200).json({ message: "Déconnecté avec succès." });
};

//pour afficher le dernier utilisatuer inscrit 

export const getLatestUser = async(req, res) => {
  try {
    const latestUser = await prisma.user.findFirst({
      orderBy: {
        created_at: "desc"
      },
      select: {
        id: true,
          nom: true,
        prenom: true,
        location: true,
        surf_level: true,
        username: true,
        email: true,
        role: true,
        location: true,
        surf_level: true,
      
        password: true,
     
      }
    });

    if (!latestUser) {
      return res.status(404).json({ erreur: "Données non trouvées !" });
    }

    res.json(latestUser);
  } catch (error) {
    console.error("Erreur récupération dernier utilisateur :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

export const getProfile = async (req, res) => {
  console.log('Récupération du profil utilisateur...');
  const accessToken = req.headers['authorization']?.split(' ')[1];
  try {
    console.log('req.user:', req.user); // Debug
    console.log('req.headers:', req.headers); // Debug

      if (!accessToken) {
    console.log("Aucun token fourni.");
    return res.sendStatus(401);
  }

  
    
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        error: "Token d'authentification invalide ou manquant.",
        debug: "req.user est undefined" 
      });
    }

      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Token invalide ou expiré:", err);
      return res.sendStatus(403);
    }
    console.log("Utilisateur décodé:", user); // Debug
    req.user = user; // Attache l'utilisateur à la requête
    //next();
  });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        prenom: true,
        nom: true,
        location: true,
        surf_level: true,
        username: true,
        email: true,
        role: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

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
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};