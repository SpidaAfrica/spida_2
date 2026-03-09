import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { spiTractorsApi } from "../api/spiTractorsApi";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const tractorIcon = {
  url: "/icons/tractor.png", // add tractor icon in public/icons
  scaledSize: { width: 40, height: 40 },
};

export default function NearbyTractorsMap({ farmerLat, farmerLng }) {
  const [tractors, setTractors] = useState([]);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  async function loadNearby() {
    try {
      const res = await spiTractorsApi.getNearbyTractors({
        lat: farmerLat,
        lng: farmerLng,
        radius: 50,
      });

      setTractors(res.tractors || []);
    } catch (err) {
      console.error("Nearby tractors error:", err.message);
    }
  }

  useEffect(() => {
    loadNearby();

    // refresh every 10 seconds (simulate real-time)
    const interval = setInterval(loadNearby, 10000);

    return () => clearInterval(interval);
  }, [farmerLat, farmerLng]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={{ lat: farmerLat, lng: farmerLng }}
      zoom={12}
      onLoad={(map) => (mapRef.current = map)}
    >
      {/* Farmer Marker */}
      <Marker
        position={{ lat: farmerLat, lng: farmerLng }}
        label="Farm"
      />

      {/* Tractor Markers */}
      {tractors.map((tractor) => (
        <Marker
          key={tractor.id}
          position={{
            lat: parseFloat(tractor.lat),
            lng: parseFloat(tractor.lng),
          }}
          icon={tractorIcon}
        />
      ))}

      {/* Lines from farmer to tractor */}
      {tractors.map((tractor) => (
        <Polyline
          key={`line-${tractor.id}`}
          path={[
            { lat: farmerLat, lng: farmerLng },
            { lat: parseFloat(tractor.lat), lng: parseFloat(tractor.lng) },
          ]}
          options={{
            strokeColor: "#2e7d32",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      ))}
    </GoogleMap>
  );
}