import { fetchWeatherApi } from "openmeteo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Definir les interfaces pour une meilleure clarté des données
interface SurfSpotData {
  time: string;
  waveHeight: string;
  windSpeed: string;
  windDirection: string;
  swellHeight: string;
  swellDirection: string;
  swellPeriod: string;
  waterTemp: string;
  comment: string;
}

// Mappage des spots avec leurs coordonnées et noms
const surfSpotsCoordinates: Record<
  string,
  { name: string; lat: number; lon: number; webcamImage: string }
> = {
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
  nice: {
    name: "Nice",
    lat: 43.695,
    lon: 7.265,
    webcamImage: "/default-webcam.jpg",
  },
};


//  Détermine le commentaire de surf en fonction du vent et de la hauteur des vagues.
const getWeatherComment = (windSpeed: number, waveHeight: number): string => {
  // Conditions idéales : vent faible et vagues significatives
  if (windSpeed < 15 && waveHeight > 1.5) return "thumbsup";
  // Mauvaises conditions : vent trop fort ou vagues trop petites
  if (windSpeed > 25 || waveHeight < 0.5) return "thumbsdown";
  // Conditions acceptables/moyennes
  return "shaka";
};


// Récupère l'URL de la webcam la plus proche via l'API Windy.
async function getWebcamImageUrl(lat: number, lon: number): Promise<string> {
  const apiKey = process.env.WINDY_API_KEY;
  if (!apiKey) {
    console.error("WINDY_API_KEY non configurée.");
    return "/default-webcam.jpg";
  }

  const url = `https://api.windy.com/webcams/api/v3/webcams?nearby=${lat},${lon},50&include=images`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-windy-api-key": apiKey,
    },
  });

  if (response.ok) {
    const data = await response.json();
    if (data && data.webcams && data.webcams.length > 0) {
      const webcam = data.webcams[0];
      if (webcam.images?.current?.preview) {
        return webcam.images.current.preview;
      }
    }
  }

  console.error(
    `Erreur lors de la récupération de la webcam pour ${lat}, ${lon}.`
  );
  return "/default-webcam.jpg";
}

export default async function SpotPage({
  params,
}: {
  params: { spot: string };
}) {
  const { spot } = await params;
  const spotKey = spot.toLowerCase();
  const spotData = surfSpotsCoordinates[spotKey];

  // Gérer le cas où le spot n'est pas trouvé
  if (!spotData) {
    return (
      <div className="p-10 text-center text-red-600">Spot non trouvé ❌</div>
    );
  }

  // Paramètres pour l'API Marine Weather
  const marineParams = {
    latitude: spotData.lat,
    longitude: spotData.lon,
    hourly: [
      "wave_height",
      "swell_wave_height",
      "swell_wave_direction",
      "swell_wave_period",
    ],
    timezone: "Europe/Paris",
    forecast_days: 1,
  };

  // Paramètres pour l'API Atmospheric Weather (vent et température)
  const atmosphericParams = {
    latitude: spotData.lat,
    longitude: spotData.lon,
    hourly: ["temperature_2m", "wind_speed_10m", "wind_direction_10m"],
    timezone: "Europe/Paris",
    forecast_days: 1,
  };

  // Exécution parallèle des requêtes API
  const [marineResponses, atmosphericResponses] = await Promise.all([
    fetchWeatherApi(
      "https://marine-api.open-meteo.com/v1/marine",
      marineParams
    ),
    fetchWeatherApi(
      "https://api.open-meteo.com/v1/forecast",
      atmosphericParams
    ),
  ]);

  const marineResponse = marineResponses[0];
  const atmosphericResponse = atmosphericResponses[0];

  const marineHourly = marineResponse.hourly()!;
  const atmosphericHourly = atmosphericResponse.hourly()!;

  const hourly = marineResponse.hourly()!;
  const utcOffsetSeconds = marineResponse.utcOffsetSeconds();
  const interval = hourly.interval();

  // Créer un tableau de dates pour l'intervalle de temps
  const times = [
    ...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / interval),
  ].map(
    (_, i) =>
      new Date((Number(hourly.time()) + i * interval + utcOffsetSeconds) * 1000)
  );

  // Extraction des données des réponses API
  const waveHeightData = marineHourly.variables(0)?.valuesArray() || [];
  const swellHeightData = marineHourly.variables(1)?.valuesArray() || [];
  const swellDirectionData = marineHourly.variables(2)?.valuesArray() || [];
  const swellPeriodData = marineHourly.variables(3)?.valuesArray() || [];

  const windSpeedData = atmosphericHourly.variables(0)?.valuesArray() || [];
  const windDirectionData = atmosphericHourly.variables(1)?.valuesArray() || [];
  const waterTempData = atmosphericHourly.variables(2)?.valuesArray() || [];

  const surfTimes = [9, 13, 17];
  const spotForecastData: SurfSpotData[] = surfTimes.map((hour) => {
    const timeIndex = times.findIndex((t) => t.getHours() === hour);
    const index = timeIndex >= 0 ? timeIndex : 0;

    const windSpeed = windSpeedData[index] ?? 0;
    const waveHeight = waveHeightData[index] ?? 0;
    const swellHeight = swellHeightData[index] ?? 0;
    const totalWaveHeight = Math.max(waveHeight, swellHeight);

    return {
      time: `${hour}h`,
      waveHeight: `${totalWaveHeight.toFixed(1)} m`,
      windSpeed: `${Math.round(windSpeed)} km/h`,
      windDirection: `${Math.round(windDirectionData[index] ?? 0)}°`,
      swellHeight: `${swellHeight.toFixed(1)} m`,
      swellDirection: `${Math.round(swellDirectionData[index] ?? 0)}°`,
      swellPeriod: `${(swellPeriodData[index] ?? 0).toFixed(1)} s`,
      waterTemp: `${(waterTempData[index] ?? 20).toFixed(1)} °C`,
      comment: getWeatherComment(windSpeed, totalWaveHeight),
    };
  });

  const getCommentIcon = (comment: string) => {
    switch (comment) {
      case "thumbsup":
        return "👍";
      case "thumbsdown":
        return "👎";
      case "shaka":
        return "🤙";
      default:
        return "🤙";
    }
  };

  const webcamImage = await getWebcamImageUrl(spotData.lat, spotData.lon);

  return (
    <div className="min-h-screen bg-[url('/surfbg.jpg')] bg-cover bg-center bg-fixed relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="w-full max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-xl min-h-[90vh] flex flex-col z-10 relative">
        <div className="relative z-20 hidden md:block">
          <Header />
        </div>

        <main className="flex-1 p-6 space-y-8 md:pb-0 pb-20">
          <h2 className="text-2xl font-bold text-[#0077B6] text-center">
            {spotData.name}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr>
                  <th></th>
                  {spotForecastData.map((s, i) => (
                    <th
                      key={i}
                      className="border-b border-[#0077B6] text-center py-2 text-sm font-bold text-gray-800"
                    >
                      {s.time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">
                    Hauteur des vagues:
                  </td>
                  {spotForecastData.map((s, i) => (
                    <td key={i} className="py-2 px-2 text-center text-gray-700">
                      {s.waveHeight}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">Hauteur houle:</td>
                  {spotForecastData.map((s, i) => (
                    <td key={i} className="py-2 px-2 text-center text-gray-700">
                      {s.swellHeight}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">Direction houle:</td>
                  {spotForecastData.map((s, i) => (
                    <td key={i} className="py-2 px-2 text-center text-gray-700">
                      {s.swellDirection}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">Période houle:</td>
                  {spotForecastData.map((s, i) => (
                    <td key={i} className="py-2 px-2 text-center text-gray-700">
                      {s.swellPeriod}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">Vitesse vent:</td>
                  {spotForecastData.map((s, i) => (
                    <td key={i} className="py-2 px-2 text-center text-gray-700">
                      {s.windSpeed}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">
                    Direction du vent:
                  </td>
                  {spotForecastData.map((s, i) => (
                    <td key={i} className="py-2 px-2 text-center text-gray-700">
                      {s.windDirection}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">
                    Température de l'eau:
                  </td>
                  {spotForecastData.map((s, i) => (
                    <td key={i} className="py-2 px-2 text-center text-gray-700">
                      {s.waterTemp}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="pr-4 py-2 text-gray-500">Commentaire:</td>
                  {spotForecastData.map((s, i) => (
                    <td key={i} className="text-center text-lg">
                      {getCommentIcon(s.comment)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            <div className="mt-6 space-y-4">
              <h4 className="text-xl font-bold text-[#0077B6]">Webcam</h4>
              <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={webcamImage}
                  alt={`Webcam de ${spotData.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 text-right mt-2 mb-8">
                Dernière mise à jour: {new Date().toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
