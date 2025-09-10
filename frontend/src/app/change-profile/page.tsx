"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { 
  validatePassword, 
  getPasswordFieldClasses, 
  getPasswordCriteria,
  type PasswordValidation 
} from "../../utils/password-validator";

export default function changeProfile() {
  // Définition de l'état du formulaire
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [utilisateur, setUtilisateur] = useState("");
  const [adresse, setAdresse] = useState("");
  const [surf, setSurf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
  async function fetchProfile() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
      const response = await fetch(`${baseUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) return;
      const user = await response.json();
      setPrenom(user.prenom || "");
      setNom(user.nom || "");
      setUtilisateur(user.utilisateur || "");
      setAdresse(user.adresse || "");
      setSurf(user.surf || "");
      setEmail(user.email || "");
      // Ne pré-remplit pas le mot de passe pour la sécurité
    } catch (err) {
      // Optionnel : gérer l’erreur
    }
  }
  fetchProfile();
}, []);



  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

 

    setLoading(true);
    try {
      const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${baseUrl}/change-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
               "Authorization": `Bearer ${token}` // AJOUTE CE HEADER !
          },
          body: JSON.stringify({ 
            prenom, 
            nom, 
            utilisateur, 
            adresse, 
            surf, 
            email, 
            password 
          }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        // Redirection après un succès, sans utiliser Next.js
        window.location.href = "/profil";
      } else {
        setError(data.message || "Échec de l'inscription. Vérifiez vos informations.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Récupère les critères de validation pour l'affichage depuis le fichier utils/password-validator.ts
  const passwordCriteria = getPasswordCriteria();

  return (
    // Conteneur principal avec une mise en page flexible et centrée
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url('/surfbg.jpg')] bg-cover bg-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full border-2 border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#0096C7]">
          Modification du compte
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Le formulaire utilise une grille responsive pour les écrans moyens et plus grands */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grille à deux colonnes pour les champs Prénom et Nom sur les grands écrans */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4 gap-y-4">
            <div>
              <label className="block mb-2 font-medium text-[#2D3A40]" htmlFor="prenom">
                Prénom :
              </label>
              <input
                id="prenom"
                type="text"
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Entrez votre prénom"
                value={prenom}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-[#2D3A40]" htmlFor="nom">
                Nom :
              </label>
              <input
                id="nom"
                type="text"
                onChange={(e) => setNom(e.target.value)}
                placeholder="Entrez votre nom"
                value={nom}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Grille à deux colonnes pour les champs Adresse et Niveau de surf sur les grands écrans */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4 gap-y-4">
            <div>
              <label className="block mb-2 font-medium text-[#2D3A40]" htmlFor="adresse">
                Adresse :
              </label>
              <input
                id="adresse"
                type="text"
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Entrez votre adresse"
                value={adresse}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] placeholder:text-gray-400"
              />
            </div>
            <div>
              <label
                className="block mb-2 font-medium text-[#2D3A40]"
                htmlFor="surf"
              >
                Niveau du surf
              </label>
              <select
                value={surf}
                onChange={(e) => setSurf(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] text-gray-700"
              >
                <option value="" disabled hidden>
                  Sélectionnez votre niveau
                </option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Les autres champs restent sur une seule colonne */}
          <div>
            <label
              className="block mb-2 font-medium text-[#2D3A40]"
              htmlFor="utilisateur"
            >
              Utilisateur
            </label>
            <input
              id="utilisateur"
              type="text"
              value={utilisateur}
              onChange={(e) => setUtilisateur(e.target.value)}
              placeholder="Votre utilisateur"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] placeholder:text-gray-400"
            />
          </div>

          <div>
            <label
              className="block mb-2 font-medium text-[#2D3A40]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] placeholder:text-gray-400"
            />
          </div>

        

          {/* Bouton de soumission */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0077B6] text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg hover:bg-[#005F99] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Chargement..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
       
        