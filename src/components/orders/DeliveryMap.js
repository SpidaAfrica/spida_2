import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = { lat: 7.25, lng: 5.2 };

const DeliveryMap = ({ orders }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn(err)
    );
  }, []);

  const geocodeAddress = (geocoder, address) => {
    return new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          console.warn("Geocode failed:", status, address);
          resolve(null);
        }
      });
    });
  };

  const fetchCoordinates = useCallback(async () => {
    if (!window.google || !window.google.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    const results = [];

    for (const order of orders) {
      if (order.farm_address) {
        const pickupCoords = await geocodeAddress(geocoder, order.farm_address);
        if (pickupCoords) results.push({ ...order, type: "pickup", coords: pickupCoords });
      }
      if (order.address) {
        const deliveryCoords = await geocodeAddress(geocoder, order.address);
        if (deliveryCoords) results.push({ ...order, type: "delivery", coords: deliveryCoords });
      }
    }
    setMarkers(results);
  }, [orders]);

  useEffect(() => {
    if (mapLoaded && orders.length > 0) {
      fetchCoordinates();
    }
  }, [mapLoaded, orders, fetchCoordinates]);
  console.log(orders.address);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDeiTX6cfrRVrGA1wJnZh_ro957siC6A1c"
      onLoad={() => setMapLoaded(true)}
    >
      <GoogleMap mapContainerStyle={containerStyle} center={userLocation || center} zoom={8}>
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
          />
        )}

        {markers.map((marker, i) => (
          <Marker
            key={`${marker.type}-${i}`}
            position={marker.coords}
            icon={{
              url:
                marker.type === "pickup"
                  ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default DeliveryMap;
