// app/hotspot/guide/page.tsx
import MainLayout from "@/components/MainLayout";

export default function SurfGuidePage() {
  return (
    <>
      <MainLayout>
       
    

          <main className="flex-1 p-6 space-y-8 md:pb-0 pb-12">
            <h1 className="text-4xl font-bold text-[#0077B6] text-center mb-6">
              Guide pour interpréter les données de surf
            </h1>

            <section className="bg-white/10 p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-2xl font-bold text-[#0077B6]">
                1️⃣ Heure de la journée
              </h2>
              <p className="text-gray-900">
                Les colonnes du tableau correspondent à des heures précises (par
                exemple, 9h, 13h, 17h). Chaque valeur indique la prévision pour
                cette heure spécifique. <br />
                <br />
                🔹 La température de l&apos;eau, la hauteur des vagues et le vent
                peuvent varier légèrement d&apos;une heure à l&apos;autre. <br />
                🔹 Attention, les valeurs sont des prévisions et non des mesures
                exactes.
              </p>
            </section>

            <section className="bg-white/10 p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-2xl font-bold text-[#0077B6]">
                2️⃣ Hauteur des vagues
              </h2>
              <p className="text-gray-900">
                Indique la hauteur des vagues en centimètres. <br />
                <br />
                🔹 Plus grand = meilleures vagues pour surfer. <br />
                🔹 Moins de 10 cm = conditions peu favorables.
              </p>

              <p className="text-gray-900">
                Exemple : 40 cm = vagues moyennes, 60 cm = grosses vagues.
              </p>
            </section>

            <section className="bg-white/10 p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-2xl font-bold text-[#0077B6]">
                3️⃣ Vent et direction
              </h2>
              <p className="text-gray-900">
                Indique la vitesse et la direction du vent. <br />
                <br />
                🔹 Vent faible (&lt;15 km/h) = idéal pour surfer. <br />
                🔹 Vent fort (&gt; 25 km/h) = peut détériorer les vagues. <br /> <br />
                Direction en degrés (0° = nord, 90° = est). Les meilleurs spots
                fonctionnent souvent avec vent offshore (en direction de la
                mer).
              </p>
            </section>

            <section className="bg-white/10 p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-2xl font-bold text-[#0077B6]">
                4️⃣ Température de l&apos;eau
              </h2>
              <p className="text-gray-900">
                Indique la température de l&apos;eau en degrés Celsius. <br /> <br />
               🔹 Plus chaude = plus confortable pour surfer. <br />
               🔹 Plus froide = combinaison néoprène nécessaire.
              </p>
            </section>

            <section className="bg-white/10 p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-2xl font-bold text-[#0077B6]">
                5️⃣ Marée (niveau de la mer)
              </h2>
              <p className="text-gray-900">
                Indique le niveau de la mer en mètres, y compris la marée. <br /> <br />
                🔹 Haute mer = certaines vagues fonctionnent mieux. <br />
                🔹 Basse mer = certaines vagues deviennent peu profondes.
              </p>
            </section>

            <section className="bg-white/10 p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-2xl font-bold text-[#0077B6]">
                6️⃣ Icônes de commentaire
              </h2>
              <div className="flex gap-6 justify-center text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-2xl">👍</span>
                  <p className="text-gray-900">Bonnes conditions</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl">🤙</span>
                  <p className="text-gray-900">Acceptable</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl">👎</span>
                  <p className="text-gray-900">Conditions défavorables</p>
                </div>
              </div>
            </section>

            <section className="bg-white/10 p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-2xl font-bold text-[#0077B6]">💡 Résumé</h2>
              <p className="text-gray-900">
                Pour choisir la meilleure heure pour surfer, recherchez :
              </p>
              <ul className="list-disc list-inside text-gray-900">
                <li>Vagues de bonne hauteur (&gt; 30 cm)</li>
                <li>Vent faible et offshore</li>
                <li>Marée adaptée au spot</li>
                <li>Température de l&apos;eau confortable</li>
              </ul>
            </section>
            {/* Retour à l'accueil */}
<div className="flex justify-center mt-8 mb-12">
  <a
    href="accueil"
    className="bg-[#0077B6] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-[#005F99] transition-colors"
  >
    ⬅ Retour à l&apos;accueil
  </a>
</div>

            {/* Footer & Message */}
            <div className="p-4 text-center text-sm text-gray-700 border-t border-gray-200 pb-10">
              Bonne session ! 🤙
            </div>
          </main>
           </MainLayout>
    </>
  );
}
