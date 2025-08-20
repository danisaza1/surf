// app/hotspot/page.tsx
import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface SurfSpotData {
  time: string;
  waveHeight: string;
  windSpeed: string;
  swellLength: string;
  waterTemp: string;
  comment: string;
}

interface SurfSpot {
  name: string;
  data: SurfSpotData[];
  webcamImage: string;
  lastUpdated: string;
}

const surfSpots: { [key: string]: SurfSpot } = {
  hossegor: {
    name: "Hossegor",
    data: [
      {
        time: "9h",
        waveHeight: "3 cm",
        windSpeed: "1-2B",
        swellLength: "7",
        waterTemp: "22,8 °C",
        comment: "thumbsup",
      },
      {
        time: "13h",
        waveHeight: "50 cm",
        windSpeed: "1B",
        swellLength: "9",
        waterTemp: "30,8 °C",
        comment: "thumbsdown",
      },
      {
        time: "17h",
        waveHeight: "3 cm",
        windSpeed: "2B",
        swellLength: "2",
        waterTemp: "19 °C",
        comment: "shaka",
      },
    ],
    webcamImage: "/webcam.png",
    lastUpdated: "Oct 12, 2023",
  },
  lacanau: {
    name: "Lacanau",
    data: [
      {
        time: "10h",
        waveHeight: "15 cm",
        windSpeed: "3B",
        swellLength: "5",
        waterTemp: "21 °C",
        comment: "thumbsup",
      },
      {
        time: "14h",
        waveHeight: "20 cm",
        windSpeed: "2B",
        swellLength: "6",
        waterTemp: "22 °C",
        comment: "thumbsup",
      },
      {
        time: "18h",
        waveHeight: "5 cm",
        windSpeed: "1B",
        swellLength: "3",
        waterTemp: "18 °C",
        comment: "thumbsdown",
      },
    ],
    webcamImage: "/lacanau_webcam.png",
    lastUpdated: "Oct 12, 2023",
  },
  biarritz: {
    name: "Biarritz",
    data: [
      {
        time: "8h",
        waveHeight: "25 cm",
        windSpeed: "1B",
        swellLength: "8",
        waterTemp: "20 °C",
        comment: "shaka",
      },
      {
        time: "12h",
        waveHeight: "30 cm",
        windSpeed: "2B",
        swellLength: "7",
        waterTemp: "25 °C",
        comment: "thumbsup",
      },
    ],
    webcamImage: "/biarritz_webcam.png",
    lastUpdated: "Oct 12, 2023",
  },
};

export default function HotspotPage() {
  const getCommentIcon = (comment: string) => {
    switch (comment) {
      case "thumbsup":
        return "👍";
      case "thumbsdown":
        return "👎";
      case "shaka":
        return "🤙";
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[url('/surfbg.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="w-full max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-xl min-h-[90vh] flex flex-col z-10 relative">
        <div className="relative z-20">
          <Header />
        </div>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            Spots de surf:
          </h2>

          {Object.keys(surfSpots).map((spotKey) => {
            const currentSpot = surfSpots[spotKey];
            return (
              <div key={spotKey} className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-5 shadow-inner space-y-4">
                  <h3 className="flex text-2xl justify-center font-bold text-[#0077B6]">
                    {currentSpot.name}
                  </h3>

                  {/* Tableau avec les heures comme en-têtes */}
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm">
                      <thead  >
                        <tr className="">
                          <th></th>
                          {currentSpot.data.map((spot, index) => (
                            <th key={index} className=" border-b border-[#0077B6] text-center py-2 text-sm font-bold text-gray-800 ">
                              {spot.time}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody >
                        <tr className=" border-b border-gray-200">
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Hauteur des vagues:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td key={index} className="py-2 px-2 text-center text-gray-800">
                              {spot.waveHeight}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Vitesse vent:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td key={index} className="py-2 px-2 text-center text-gray-800">
                              {spot.windSpeed}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Longueur houle:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td key={index} className="py-2 px-2 text-center text-gray-800">
                              {spot.swellLength}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Température de l'eau:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td key={index} className="py-2 px-2 text-center text-gray-800">
                              {spot.waterTemp}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Commentaire:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td key={index} className="py-2 px-2 text-center text-lg">
                              {getCommentIcon(spot.comment)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Webcam */}
                  <div className="mt-6 space-y-4">
                    <h4 className="text-xl font-bold text-[#0077B6]">
                      Webcam
                    </h4>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={currentSpot.webcamImage}
                        alt={`Webcam en vivo de ${currentSpot.name}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-2">
                      Last Updated: {currentSpot.lastUpdated}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </main>

        <div className="w-full mt-auto relative z-20">
          <Footer />
        </div>
      </div>
    </div>
  );
}
