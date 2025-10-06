import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>

      <div className="h-screen bg-[url('/surfbg.jpg')] bg-cover bg-center relative flex items-center justify-center">
        {/* Overlay noir */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Contenu centré */}
        <div className="flex flex-col text-white relative z-10 p-4 sm:p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold mb-8">Waveo</h1>
            <p className="text-lg sm:text-xl font-medium">
              Votre compte a été créé avec succès
            </p>
            <p className="text-sm mt-2 font-light">
              Vous pouvez maintenant vous connecter à votre compte.
            </p>
          </div>

          <div className="w-full flex flex-col space-y-4 max-w-sm mx-auto">
            <Link href="/login">
            <button className="w-full mt-8 bg-white text-[#0096C7] py-3 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors">
              Connectez-vous
            </button>
            </Link>
           
            
          </div>
        </div>
      </div>
    </>
  );
}