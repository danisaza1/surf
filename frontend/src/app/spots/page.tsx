// app/hotspot/page.tsx
import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { fetchWeatherApi } from "openmeteo";

interface SurfSpotData {
  time: string;
  waveHeight: string;
  windSpeed: string;
  windDirection: string;
  swellLength: string;
  waterTemp: string;
  comment: string;
}

interface SurfSpot {
  name: string;
  data: SurfSpotData[];
  webcamImage: string;
  webcamIframe?: string; 
  lastUpdated: string;
}


const surfSpotsCoordinates = {
  hossegor: {
    name: "Hossegor",
    lat: 43.665,
    lon: -1.4273,
    webcamImage: "/default-webcam.jpg",
  },
  lacanau: {
    name: "Lacanau",
    lat: 45.0007,
    lon: -1.2039,
    webcamImage: "/default-webcam.jpg",
  },
  biarritz: {
    name: "Biarritz",
    lat: 43.4832,
    lon: -1.5586,
    webcamImage: "/default-webcam.jpg",
  },
};

// Función para obtener el icono de comentario basado en las condiciones
const getWeatherComment = (windSpeed: number, waveHeight: number): string => {
  if (windSpeed < 15 && waveHeight > 30) return "thumbsup";
  if (windSpeed > 25 || waveHeight < 10) return "thumbsdown";
  return "shaka";
};

// Función corregida para obtener imagen de webcam
async function getWebcamImageUrl(lat: number, lon: number): Promise<string> {
  try {
    if (!process.env.WINDY_API_KEY) {
      console.error("WINDY_API_KEY no está configurada en las variables de entorno");
      return "/default-webcam.jpg";
    }

    // El endpoint v3 correcto para buscar webcams por coordenadas
    const url = `https://api.windy.com/webcams/api/v3/webcams?nearby=${lat},${lon},50&include=images`;
    
    
    console.log("🔍 Intentando con Windy API v3 (endpoint corregido):", url.replace(process.env.WINDY_API_KEY, '[API_KEY_HIDDEN]'));

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // El API key para la v3 debe ir en el header 'x-windy-api-key'
        'x-windy-api-key': process.env.WINDY_API_KEY,
      }
    });

    console.log(`📡 Respuesta Windy API: ${response.status} - ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Respuesta exitosa de Windy:", JSON.stringify(data, null, 2));

      if (data && data.webcams && data.webcams.length > 0) {
        const webcam = data.webcams[0];
        
        // La estructura de datos para v3 es diferente
        if (webcam.images?.current?.preview) {
          console.log("🎥 Webcam encontrada:", webcam.images.current.preview);
          return webcam.images.current.preview;
        }
      }
    } else {
      const errorText = await response.text();
      console.error(`❌ Error Windy API: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error("❌ Error general en getWebcamImageUrl:", error);
  }

  // 🔧 Si todo falla, retorna imagen por defecto
  return "/default-webcam.jpg";
}


// Función para recuperar los datos meteorológicos
async function getSurfSpotsData(): Promise<{ [key: string]: SurfSpot }> {
  const spots: { [key: string]: SurfSpot } = {};

  for (const [key, spot] of Object.entries(surfSpotsCoordinates)) {
    try {
      const params = {
        latitude: spot.lat,
        longitude: spot.lon,
        hourly: ["temperature_2m", "wind_speed_10m", "wind_direction_10m", "temperature_80m"],
        current: "is_day",
        timezone: "Europe/Paris",
        forecast_days: 1,
      };

      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];

      const hourly = response.hourly()!;
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const interval = hourly.interval();

      // Crear los timestamps
      const times = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / interval)]
        .map((_, i) =>
          new Date((Number(hourly.time()) + i * interval + utcOffsetSeconds) * 1000)
        );

      // Extraer los datos meteorológicos con verificación null
      const temperatureData = hourly.variables(0)?.valuesArray() || [];
      const windSpeedData = hourly.variables(1)?.valuesArray() || [];
      const windDirectionData = hourly.variables(2)?.valuesArray() || [];
      const waterTempData = hourly.variables(3)?.valuesArray() || [];

      // Filtrar las horas de surf (9h, 13h, 17h por ejemplo)
      const surfTimes = [9, 13, 17];
      const spotData: SurfSpotData[] = surfTimes.map((hour) => {
        // Encontrar el índice correspondiente a la hora deseada
        const timeIndex = times.findIndex(time => time.getHours() === hour);
        const index = timeIndex >= 0 ? timeIndex : 0;

        const windSpeed = windSpeedData[index] ?? 0;
        const waveHeight = Math.floor(Math.random() * 60) + 10; // Simulación olas 10-70cm

        return {
          time: `${hour}h`,
          waveHeight: `${waveHeight} cm`,
          windSpeed: `${Math.round(windSpeed)} km/h`,
          windDirection: `${Math.round(windDirectionData[index] ?? 0)}°`,
          swellLength: `${Math.floor(Math.random() * 8) + 3}`, // Simulación 3-10s
          waterTemp: `${(waterTempData[index] ?? 20).toFixed(1)} °C`,
          comment: getWeatherComment(windSpeed, waveHeight),
        };
      });

      // Obtener imagen de webcam para este spot específico
      const webcamImage = await getWebcamImageUrl(spot.lat, spot.lon);

      spots[key] = {
        name: spot.name,
        data: spotData,
        webcamImage: webcamImage,
        lastUpdated: new Date().toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch (error) {
      console.error(`Error fetching data for ${spot.name}:`, error);
      // Datos de fallback en caso de error
      spots[key] = {
        name: spot.name,
        data: [
          {
            time: "9h",
            waveHeight: "-- cm",
            windSpeed: "-- km/h",
            windDirection: "--°",
            swellLength: "--",
            waterTemp: "-- °C",
            comment: "thumbsdown",
          },
          {
            time: "13h",
            waveHeight: "-- cm",
            windSpeed: "-- km/h",
            windDirection: "--°",
            swellLength: "--",
            waterTemp: "-- °C",
            comment: "thumbsdown",
          },
          {
            time: "17h",
            waveHeight: "-- cm",
            windSpeed: "-- km/h",
            windDirection: "--°",
            swellLength: "--",
            waterTemp: "-- °C",
            comment: "thumbsdown",
          },
        ],
        webcamImage: "/default-webcam.jpg",
        lastUpdated: "Datos no disponibles",
      };
    }
  }

  return spots;
}

export default async function HotspotPage() {
  // Recuperar los datos meteorológicos del lado del servidor
  const surfSpots = await getSurfSpotsData();

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

                  <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm">
                      <thead>
                        <tr>
                          <th></th>
                          {currentSpot.data.map((spot, index) => (
                            <th
                              key={index}
                              className="border-b border-[#0077B6] text-center py-2 text-sm font-bold text-gray-800"
                            >
                              {spot.time}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Hauteur des vagues:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td
                              key={index}
                              className="py-2 px-2 text-center text-gray-800"
                            >
                              {spot.waveHeight}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Vitesse vent:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td
                              key={index}
                              className="py-2 px-2 text-center text-gray-800"
                            >
                              {spot.windSpeed}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Direction du vent:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td
                              key={index}
                              className="py-2 px-2 text-center text-gray-800"
                            >
                              {spot.windDirection}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Longueur houle:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td
                              key={index}
                              className="py-2 px-2 text-center text-gray-800"
                            >
                              {spot.swellLength}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Température de l'eau:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td
                              key={index}
                              className="py-2 px-2 text-center text-gray-800"
                            >
                              {spot.waterTemp}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="pr-4 py-2 whitespace-nowrap text-gray-500">
                            Commentaire:
                          </td>
                          {currentSpot.data.map((spot, index) => (
                            <td
                              key={index}
                              className="py-2 px-2 text-center text-lg"
                            >
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
                    {currentSpot.webcamImage.endsWith(".jpg") ? (
  <img
    src={currentSpot.webcamImage}
    alt={`Webcam en vivo de ${currentSpot.name}`}
    className="w-full h-full object-cover"
  />
) : (
  <iframe
    src={currentSpot.webcamImage}
    width="100%"
    height="200"
    allow="autoplay; fullscreen"
    className="rounded-lg shadow-lg"
  ></iframe>
)}

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