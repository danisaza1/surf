"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  firstname: string;
  lastname: string;
  location: string;
  email: string;
  password: string;
};

export default function CreateLog() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    location: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Données envoyées :", formData);

    try {
      const res = await fetch("http://patacoeur-backend.vercel.app/api/adoptant/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Réponse du serveur :", data);

      if (res.ok) {
        setFormData({
          firstname: "",
          lastname: "",
          location: "",
          email: "",
          password: "",
        });
        // ✅ Redirection après succès :
        console.log("Redirection vers confirmationform");

        router.push("/confirmationform");
      } else {
        console.error("Erreur HTTP :", res.status);
        console.error("Détails :", data);
      }
    } catch (error) {
      console.error("Erreur de réseau ou JS :", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <section className="relative h-auto min-h-[50px] ">
    
        {/* Contenu centré verticalement et horizontalement */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 ">
          <h2 className="text-xl font-semibold mb-6 text-center">WAVEO</h2>
                </div>
      </section>

    <section className="bg-gray-100 py-0 px-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-2 border-gray-100">
  
 <h2 className="text-xl font-semibold mb-6 text-center">
              Je crée mon compte
            </h2>
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Prénom & Nom */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex items-center w-full gap-4">
          <label htmlFor="firstname" className="block mb-1 font-medium">
            Prénom :
          </label>
          <input
            id="firstname"
            type="text"
            placeholder="Entrez votre prénom"
            value={formData.firstname}
            onChange={handleChange}
            name="firstname"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center w-full gap-4">
          <label htmlFor="lastname" className="w-20 text-right">
            Nom :
          </label>
          <input
            id="lastname"
            type="text"
            placeholder="Entrez votre nom"
            value={formData.lastname}
            onChange={handleChange}
            name="lastname"
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />
        </div>
      </div>

      {/* Adresse */}
      <div className="flex items-center gap-4">
        <label htmlFor="location" className="w-20 text-right">
          Adresse :
        </label>
        <input
          id="location"
          type="text"
          placeholder="Entrez votre adresse"
          value={formData.location}
          onChange={handleChange}
          name="location"
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
      </div>

      {/* Email & Mot de passe */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex items-center w-full gap-4">
          <label htmlFor="email" className="w-20 text-right">
            Email :
          </label>
          <input
            id="email"
            type="email"
            placeholder="Entrez votre email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div className="flex items-center w-full gap-4">
          <label htmlFor="password" className="w-20 text-right">
            Mot de passe :
          </label>
          <input
            id="password"
            type="password"
            placeholder="Entrez un mot de passe"
            value={formData.password}
            onChange={handleChange}
            name="password"
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />
        </div>
      </div>

      {/* Bouton */}
      <div className="flex justify-center mt-4">
        <button
          type="submit"
              className="w-full bg-[#324960] text-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:bg-[#4682a9] hover:text-black hover:shadow-[0_6px_12px_rgba(6,182,212,0.4)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out font-bold py-3 rounded-full flex items-center justify-center gap-2 text-lg"
        >
          Envoyer
        </button>
      </div>
    </form>
  </div>
</section>

    </>
  );
}