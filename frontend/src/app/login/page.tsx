"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link"; // Importation du composant Link
import { Eye, EyeOff } from "lucide-react"; // Ajout d'icônes pour voir le mot de passe

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Appel à ton API backend pour vérifier l'email + password
       const baseUrl = `${window.location.protocol}//${window.location.hostname}:3002`;
      
      const response = await fetch(
        `${baseUrl}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("Status:", response.status);
      console.log("Response data:", data);

      if (response.ok) {
        // Récupérer le token d'accès depuis la réponse et le stocker
        const { accessToken } = data;
        if (accessToken) {
          localStorage.setItem("token", accessToken); // Stocker dans localStorage
          router.push("/accueil"); // Rediriger vers la page d'accueil
        } else {
          setError("Échec de la connexion. Aucune réponse valide du serveur.");
        }
      } else {
        // Gérer les erreurs de connexion avec un message spécifique
        setError("Échec de la connexion. Vérifiez vos identifiants.");
      }
    } catch (err) {
      // Gérer les erreurs réseau ou autres
      setError("Erreur de connexion. Veuillez réessayer plus tard.");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };
  <div className="absolute inset-0 bg-black/50"></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url('/surfbg.jpg')]">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border-2 border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#0096C7]">
          Connexion
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block mb-2 font-medium text-[#2D3A40]"
              htmlFor="email"
            >
              Email ou nom d'utilisateur
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email ou nom d'utilisateur"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] placeholder-gray-400"
            />
          </div>

          <div>
            <label
              className="block mb-2 font-medium text-[#2D3A40]"
              htmlFor="password"
            >
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
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00B4D8]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link
              href="/mot-de-passe-oublie"
              className="text-sm text-[#0096C7] hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0077B6] text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg hover:bg-[#005F99] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Chargement..." : "Je me connecte"}
            </button>
          
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Pas encore inscrit ?{" "}
            <Link
              href="/inscription"
              className="text-[#0096C7] font-semibold hover:underline"
            >
              Crée ton compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
