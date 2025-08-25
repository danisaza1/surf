import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[url('/surfbg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative flex flex-col justify-between items-center p-4">
      {/* Overlay noir */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Conteneur principal de la carte de profil */}
            <div className="relative w-full max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-xl md:max-w-3xl lg:max-w-4xl flex flex-col my-8">
              {/* Header et salutation (visible sur desktop) */}
              <div className="hidden md:block">
                <Header />
              </div>
        <main className="w-full max-w-4xl mx-auto">{children}</main>
        <div className="hidden md:block w-full max-w-4xl mx-auto">
          <Footer />
        </div>
      </div>
      <div className="md:hidden">
        <Footer />
      </div>
    </div>
  );
}