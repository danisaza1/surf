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

export default function AdoptingForm() {
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
      <section className="relative h-auto min-h-[450px] ">
        {/* Image de fond */}
        <div className="absolute inset-0 bg-[url('/images/bgform.jpg')] bg-no-repeat bg-cover bg-center" />
        {/* Overlay opaque */}
        <div className="absolute inset-0 bg-black/48" />
        {/* Contenu centré verticalement et horizontalement */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 min-h-[300px]">
          <h2 className="text-5xl font-bold">DEVENIR ADOPTANT</h2>
          <p className="mt-4 text-xl max-w-2xl text-justify">
            Offrez un peu de votre temps, offrez-leur une seconde chance. En
            devenant bénévole chez Pattes à coeur, vous aidez des animaux à
            retrouver confiance et chaleur. Remplissez le formulaire pour
            rejoindre notre belle aventure!
          </p>
        </div>
      </section>
<section className="bg-gray-100 py-16 px-4">
  <div className="max-w-3xl mx-auto bg-white p-8 rounded-4xl shadow -mt-50 relative z-20">
    <h2 className="text-3xl font-semibold mb-4 text-center">
      FORMULAIRE D&apos;ADOPTANT
    </h2>
    <p className="mb-6 text-lg text-gray-600 text-center">
      Remplissez ce formulaire pour rencontrer un animal.
    </p>

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prénom & Nom */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex items-center w-full gap-4">
          <label htmlFor="firstname" className="w-20 text-right">
            Prénom :
          </label>
          <input
            id="firstname"
            type="text"
            placeholder="Entrez votre prénom"
            value={formData.firstname}
            onChange={handleChange}
            name="firstname"
            className="flex-1 border border-gray-300 rounded px-4 py-2"
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
      <div className="flex justify-center">
        <button
          type="submit"
              className="px-8 py-3 text-lg font-bold text-white bg-[#324960] rounded-lg shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:bg-[#6da2b5] hover:shadow-[0_6px_12px_rgba(6,182,212,0.4)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out"
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