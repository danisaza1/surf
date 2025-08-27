"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link"; // Importation du composant Link
import { Eye, EyeOff } from "lucide-react"; // Ajout d'icônes pour voir le mot de passe

export default function CreateLog() {
  const router = useRouter();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [utilisateur, setUtilisateur] = useState("");
  const [adresse, setAdresse] = useState("");
  const [surf, setSurf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États pour la validation du mot de passe
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    hasMinLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false
  });

  // Fonction de validation du mot de passe (adaptée de ton code JS)
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPasswordValidation({
        isValid: false,
        hasMinLength: false,
        hasNumber: false,
        hasUppercase: false,
        hasLowercase: false,
        hasSpecialChar: false
      });
      return;
    }

    // Transforme la string en tableau de codes ASCII
    const tableau = password.split("").map(char => char.charCodeAt(0));
    
    // Fonctions de vérification (adaptées de ton code)
    const isNumber = (elem: number) => elem > 47 && elem < 58;
    const isMajuscule = (elem: number) => elem > 64 && elem < 91;
    const isMinuscule = (elem: number) => elem > 96 && elem < 123;
    const isSpecialChar = (elem: number) => 
      (elem > 32 && elem < 48) || 
      (elem > 57 && elem < 65) || 
      (elem > 90 && elem < 97) || 
      (elem > 122 && elem < 127);

    const hasNumber = tableau.some(isNumber);
    const hasUppercase = tableau.some(isMajuscule);
    const hasLowercase = tableau.some(isMinuscule);
    const hasSpecialChar = tableau.some(isSpecialChar);
    const hasMinLength = password.length >= 8;

    const isValid = hasNumber && hasUppercase && hasLowercase && hasSpecialChar && hasMinLength;

    setPasswordValidation({
      isValid,
      hasMinLength,
      hasNumber,
      hasUppercase,
      hasLowercase,
      hasSpecialChar
    });
  };

  // Valider le mot de passe à chaque changement
  useEffect(() => {
    if (password) {
      validatePassword(password);
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérifier la validation du mot de passe avant l'envoi
    if (!passwordValidation.isValid) {
      setError("Le mot de passe ne respecte pas les critères requis.");
      return;
    }

    setLoading(true);

    // Vérifier la validation du mot de passe avant l'envoi
    if (!passwordValidation.isValid) {
      setError("Le mot de passe ne respecte pas les critères requis.");
      return;
    }

    setLoading(true);

    try {
      // Ici tu pourrais appeler ton API d'inscription au lieu de login
      const response = await fetch(
        "https://patacoeur-backend.vercel.app/api/adoptant/register/", // Changé pour register
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        // Navigation vers confirmation après succès
        router.push("/confirmation");
      } else {
        // Gérer les erreurs de connexion avec un message spécifique
        setError("Échec de la connexion. Vérifiez vos identifiants.");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer plus tard.");
      console.error("Registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url('/surfbg.jpg')] ">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border-2 border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#0096C7]">
          Creation de compte
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Adresse */}
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

          {/* Niveau de surf */}
          <div>
            <label className="block mb-2 font-medium text-[#2D3A40]" htmlFor="surf">
              Niveau de surf
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

          {/* Utilisateur / Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-[#2D3A40]" htmlFor="utilisateur">
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
              <label className="block mb-2 font-medium text-[#2D3A40]" htmlFor="email">
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
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block mb-2 font-medium text-[#2D3A40]" htmlFor="password">
            <label className="block mb-2 font-medium text-[#2D3A40]" htmlFor="password">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-400 ${
                  password && passwordValidation.isValid
                    ? 'border-green-500 text-green-600 focus:ring-green-200'
                    : password && !passwordValidation.isValid
                    ? 'border-red-500 focus:ring-red-200'
                    : 'focus:ring-[#00B4D8]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00B4D8]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Indicateurs de validation */}
            {password && (
              <div className="mt-2 text-xs space-y-1">
                <div className={passwordValidation.hasMinLength ? 'text-green-600' : 'text-red-600'}>
                  ✓ Au moins 8 caractères
                </div>
                <div className={passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-600'}>
                  ✓ Une majuscule
                </div>
                <div className={passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-600'}>
                  ✓ Une minuscule
                </div>
                <div className={passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}>
                  ✓ Un chiffre
                </div>
                <div className={passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}>
                  ✓ Un caractère spécial
                </div>
              </div>
            )}
          </div>
          {/* link a eliminer lorsque le back est installé */}
          <Link href="/confirmation" className="text-[#0077B6] hover:underline">
          <div className="flex justify-center pt-4">
            Vous avez déjà un compte ? Connectez-vous
          
            <button
              type="submit"
              disabled={loading || !passwordValidation.isValid}
              className="w-full bg-[#0077B6] text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg hover:bg-[#005F99] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
              {loading ? "Chargement..." : "Créer le compte"}
            </button>
          </div>
              </Link>
        </form>
      </div>
    </div>
  );
}