// app/hotspot/[spot]/page.tsx
import { fetchWeatherApi } from "openmeteo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SurfSpotData {
  time: string;
  waveHeight: string;
  windSpeed: string;
  windDirection: string;
  swellLength: string;
  waterTemp: string;
  tide: string
  comment: string;
}

interface SurfSpot {
  name: string;
  data: SurfSpotData[];
  webcamImage: string;
  lastUpdated: string;
}

const surfSpotsCoordinates: Record<string, { name: string; lat: number; lon: number; webcamImage: string }> = {
  hossegor: { name: "Hossegor", lat: 43.665, lon: -1.4273, webcamImage: "/default-webcam.jpg" },
  lacanau: { name: "Lacanau", lat: 45.0007, lon: -1.2039, webcamImage: "/default-webcam.jpg" },
  biarritz: { name: "Biarritz", lat: 43.4832, lon: -1.5586, webcamImage: "/default-webcam.jpg" },
  nice: { name: "Nice", lat: 43.695, lon: 7.265, webcamImage: "/default-webcam.jpg" },
};

const getWeatherComment = (windSpeed: number, waveHeight: number): string => {
  if (windSpeed < 15 && waveHeight > 30) return "thumbsup";
  if (windSpeed > 25 || waveHeight < 10) return "thumbsdown";
  return "shaka";
};

async function getWebcamImageUrl(lat: number, lon: number): Promise<string> {
  try {
    if (!process.env.WINDY_API_KEY) {
      console.error("WINDY_API_KEY no está configurada en las variables de entorno");
      return "/default-webcam.jpg";
    }

    const url = `https://api.windy.com/webcams/api/v3/webcams?nearby=${lat},${lon},50&include=images`;
    
    console.log("🔍 Intentando con Windy API v3 (endpoint corregido):", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-windy-api-key': process.env.WINDY_API_KEY,
      }
    });

    console.log(`📡 Respuesta Windy API: ${response.status} - ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Respuesta exitosa de Windy:", JSON.stringify(data, null, 2));

      if (data && data.webcams && data.webcams.length > 0) {
        const webcam = data.webcams[0];
        
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

  return "/default-webcam.jpg";
}


export default async function SpotPage({ params }: { params: { spot: string } }) {
  const spotKey = params.spot.toLowerCase();
  const spot = surfSpotsCoordinates[spotKey];

  if (!spot) {
    return <div className="p-10 text-center text-red-600">Spot non trouvé ❌</div>;
  }

  const paramsApi = {
    latitude: spot.lat,
    longitude: spot.lon,
    hourly: ["temperature_2m", "wind_speed_10m", "wind_direction_10m", "temperature_80m"],
    current: "is_day",
    timezone: "Europe/Paris",
    forecast_days: 1,
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, paramsApi);
  const response = responses[0];

  const hourly = response.hourly()!;
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const interval = hourly.interval();

  const times = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / interval)].map((_, i) =>
    new Date((Number(hourly.time()) + i * interval + utcOffsetSeconds) * 1000)
  );

  const temperatureData = hourly.variables(0)?.valuesArray() || [];
  const windSpeedData = hourly.variables(1)?.valuesArray() || [];
  const windDirectionData = hourly.variables(2)?.valuesArray() || [];
  const waterTempData = hourly.variables(3)?.valuesArray() || [];
   const tideData = hourly.variables(0)?.valuesArray() || [];

  const surfTimes = [9, 13, 17];
  const spotData: SurfSpotData[] = surfTimes.map((hour) => {
    const timeIndex = times.findIndex((t) => t.getHours() === hour);
    const index = timeIndex >= 0 ? timeIndex : 0;

    const windSpeed = windSpeedData[index] ?? 0;
    const waveHeight = Math.floor(Math.random() * 60) + 10;
    const tide = tideData[index] ?? 0;

    return {
    time: `${hour}h`,
    waveHeight: `${waveHeight} cm`,
    windSpeed: `${Math.round(windSpeed)} km/h`,
    windDirection: `${Math.round(windDirectionData[index] ?? 0)}°`,
    swellLength: `${Math.floor(Math.random() * 8) + 3}`,
    waterTemp: `${(waterTempData[index] ?? 20).toFixed(1)} °C`,
    tide: `${tide.toFixed(2)} m`,
    comment: getWeatherComment(windSpeed, waveHeight),
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
        return null;
    }
  };

  const webcamImage = await getWebcamImageUrl(spot.lat, spot.lon);

  return (
    <div className="min-h-screen bg-[url('/surfbg.jpg')] bg-cover bg-center bg-fixed relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="w-full max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-xl min-h-[90vh] flex flex-col z-10 relative">
          <div className="relative z-20 hidden md:block">
          <Header />
        </div>

        <main className="flex-1 p-6 space-y-8 md:pb-0 pb-20">
          <h2 className="text-2xl font-bold text-[#0077B6] text-center">{spot.name}</h2>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr>
                  <th></th>
                  {spotData.map((s, i) => (
                    <th key={i} className="border-b border-[#0077B6] text-center py-2 text-sm font-bold text-gray-800">
                      {s.time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">Hauteur des vagues:</td>
                  {spotData.map((s, i) => <td key={i} className="py-2 px-2 text-center text-gray-700">{s.waveHeight}</td>)}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">Vitesse vent:</td>
                  {spotData.map((s, i) => <td key={i} className="py-2 px-2 text-center text-gray-700">{s.windSpeed}</td>)}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">Direction du vent:</td>
                  {spotData.map((s, i) => <td key={i} className="py-2 px-2 text-center text-gray-700">{s.windDirection}</td>)}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">Longueur houle:</td>
                  {spotData.map((s, i) => <td key={i} className="py-2 px-2 text-center text-gray-700">{s.swellLength}</td>)}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">Température de l'eau:</td>
                  {spotData.map((s, i) => <td key={i} className="py-2 px-2 text-center text-gray-700">{s.waterTemp}</td>)}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="pr-4 py-2 text-gray-500">Marée (niveau mer):</td>
                  {spotData.map((s, i) => <td key={i} className="py-2 px-2 text-center text-gray-700">{s.tide}</td>)}
                </tr>


                <tr>
                  <td className="pr-4 py-2 text-gray-500">Commentaire:</td>
                  {spotData.map((s, i) => <td key={i} className="text-center text-lg">{getCommentIcon(s.comment)}</td>)}
                </tr>
              </tbody>
            </table>
          <div className="mt-6 space-y-4">
            <h4 className="text-xl font-bold text-[#0077B6]">Webcam</h4>
            <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg">
              <img src={webcamImage} alt={`Webcam de ${spot.name}`} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-gray-500 text-right mt-2 mb-8">
              Last Updated: {new Date().toLocaleString("fr-FR")}
            </p>
          </div>
          </div>

        </main>

        <Footer />
      </div>
    </div>
  );
}
