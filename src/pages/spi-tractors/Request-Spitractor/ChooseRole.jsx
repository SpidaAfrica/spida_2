import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChooseRole.css";

import img1 from "../../../assets/images/spitractors/img1.png";
import img2 from "../../../assets/images/spitractors/img2.png";
import img3 from "../../../assets/images/spitractors/img3.png";
import img4 from "../../../assets/images/spitractors/img4.png";

export default function ChooseRole() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: img1,
      title: "Boosted yields and improved food security",
      text: "Mechanized farming boosts yields, contributing to improved food security and livelihoods.",
    },
    {
      image: img2,
      title: "Access to modern farming equipment",
      text: "Farmers gain access to reliable machinery that reduces manual labor and increases efficiency.",
    },
    {
      image: img3,
      title: "Higher profitability for farmers",
      text: "Lower costs and higher output translate into better income for farmers.",
    },
    {
      image: img4,
      title: "Sustainable agricultural growth",
      text: "Smart mechanization supports long-term agricultural sustainability.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="choose-page">
      {/* LEFT */}
      <div className="choose-left">
        <div className="choose-wrapper">
          <img src="/spida-logo.png" alt="SPIDA" className="choose-logo" />

          <div className="choose-card">
            <h1 className="choose-title">What would you like to do?</h1>
            <p className="choose-subtitle">
              Choose your path to continue on Spida.
            </p>

            {/* Option 1 */}
            <button
              className="choose-option"
              onClick={() => navigate("/Spi_Tractors_Request/")}
              type="button"
            >
              <div className="choose-optionLeft">
                <div className="choose-ic">🚜</div>
                <div>
                  <div className="choose-optionTitle">Request a Tractor</div>
                  <div className="choose-optionText">
                    Find available tractors near your farm and book quickly.
                  </div>
                </div>
              </div>
              <div className="choose-arrow">→</div>
            </button>

            {/* Option 2 */}
            <button
              className="choose-option"
              onClick={() => navigate("/Spi_Tractors_Login/")}
              type="button"
            >
              <div className="choose-optionLeft">
                <div className="choose-ic">🧑‍🌾</div>
                <div>
                  <div className="choose-optionTitle">Rent Out My Tractor</div>
                  <div className="choose-optionText">
                    List your tractor and start earning from job requests.
                  </div>
                </div>
              </div>
              <div className="choose-arrow">→</div>
            </button>

            <div className="choose-help">
              <span>Already have an account?</span>
              <button
                className="choose-link"
                onClick={() => navigate("/Spi_Tractors_Login")}
                type="button"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT (carousel) */}
      <div className="choose-right">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`choose-slide ${index === currentSlide ? "active" : ""}`}
          >
            <img src={slide.image} alt="" className="choose-bg" />
            <div className="choose-overlay" />

            <div className="choose-rightContent">
              <div className="choose-dots">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={i === currentSlide ? "active" : ""}
                    onClick={() => setCurrentSlide(i)}
                  />
                ))}
              </div>

              <h2 className="choose-rightTitle">{slide.title}</h2>
              <p className="choose-rightText">{slide.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
