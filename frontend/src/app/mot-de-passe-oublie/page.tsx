"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Vérification que le mot de passe et la confirmation correspondent
    if (password !== confirmPassword) {
      setError("Le mot de passe et la confirmation ne correspondent pas.");
      return; // Stop le submit - CORRECTION: ça marche maintenant !
    }

    setLoading(true);

    try {
      // Appel à ton API backend
      const response = await fetch(
        "https://patacoeur-backend.vercel.app/api/adoptant/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("Status:", response.status, "Response data:", data);

      if (response.ok) {
        const { access_token } = data;
        if (access_token) {
          localStorage.setItem("token", access_token);
          // Navigation programmatique après succès
          router.push("/validate-password");
        } else {
          setError("Échec de la connexion. Aucune réponse valide du serveur.");
        }
      } else {
        setError("Échec de la connexion. Vérifiez vos identifiants.");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer plus tard.");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url('/surfbg.jpg')]">
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border-2 border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#0096C7]">
          Création nouveau mot de passe
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
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email ou nom d'utilisateur"
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] placeholder:text-gray-400"
              />
            </div>
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
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] placeholder:text-gray-400"
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

          <div>
            <label
              className="block mb-2 font-medium text-[#2D3A40]"
              htmlFor="confirmPassword"
            >
              Confirmation du mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword" // ID unique corrigé
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre mot de passe"
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8] placeholder:text-gray-400"
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
          {/* je laisse le link pour la présentation front, je l'enlève */}
        <link href="/validate-password">
          {/* CORRECTION PRINCIPALE: Supprimer le Link qui wrappait le bouton  on le retrouve dans le if avec router.push */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0077B6] text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 text-lg shadow-lg hover:bg-[#005F99] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Chargement..." : "Validation du mot de passe"}
            </button>
          </div>
        </link>
        </form>
      </div>
    </div>
  );
}