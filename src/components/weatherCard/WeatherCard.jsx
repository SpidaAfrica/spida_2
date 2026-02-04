
import React, { useEffect, useState } from "react";
import temperatureIcon from "../../assets/images/temperature.png"; // Static image for UI
import "./WeatherCard.css";

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("https://api.spida.africa/farmer/weather.php");
        const data = await response.json();
        
        if (response.ok) {
          setWeather(data);
        } else {
          setError(data.message || "Failed to fetch weather data");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <div className="weather_card">Loading weather...</div>;
  if (error) return <div className="weather_card error">{error}</div>;
  if (!weather) return null;

  // Extracting relevant data
  const {
    name: location,
    main: { temp, humidity, feels_like },
    wind: { speed },
    clouds: { all: cloudiness },
    weather: [{ description, icon }],
    sys: { sunrise, sunset },
  } = weather;

  // Convert timestamps to readable time
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="weather_card">
      <div className="">
        <div className="location">{location}</div>
        <div className="current_weather">
          <img style={{height: "100px", width: "100px"}} src={`https://openweathermap.org/img/wn/${icon}.png`} alt={description} />
          <div>
            <div className="temperature">{temp.toFixed(1)}°C</div>
            <div className="description">{description}</div>
            <div className="feels_like">Feels like: {feels_like.toFixed(1)}°C</div>
          </div>
        </div>
      </div>
      <div className="chart_info">
        <div className="forecast">
          <div className="forecast-item">
            <div className="time">Sunrise: {formatTime(sunrise)}</div>
            <div className="time">Humidity: {humidity}%</div>
            <div className="time">Wind Speed: {speed} m/s</div>
            <div className="time">Cloudiness: {cloudiness}%</div>
            <div className="time">Sunset: {formatTime(sunset)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

