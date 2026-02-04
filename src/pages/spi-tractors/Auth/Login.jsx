import React from "react";
import "./Login.css";
import img1 from "../../../assets/images/spitractors/img1.png"
import img2 from "../../../assets/images/spitractors/img2.png"
import img3 from "../../../assets/images/spitractors/img3.png"
import img4 from "../../../assets/images/spitractors/img4.png"
import { useState, useEffect } from "react";



  
export default function Spi_Tractors_Login() {

    const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 6000); // 6 seconds

  return () => clearInterval(interval);
}, []);


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
  return (
    <div className="login-page">
      {/* LEFT */}
      <div className="login-left">
        <div className="login-wrapper">
          <img src="/spida-logo.png" alt="SPIDA" className="logo" />

          <div className="login-card">
            <h1 className="title">
              Welcome Back to <span>Spida!</span>
            </h1>

            <p className="subtitle">
              Log in to continue boosting yields and improving profitability with mechanized farming.
            </p>

            <button className="social-btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
              />
              <span style={{color: "#000"}}>Sign up with Google</span>
            </button>

            <button className="social-btn">
              <img
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                alt="Facebook"
              />
              <span style={{color: "#000"}}>Sign up with Facebook</span>
            </button>

            <div className="divider">
              <span></span>
              <p>OR</p>
              <span></span>
            </div>

            <input type="email" placeholder="Email address" />
            <input type="password" placeholder="Password" />

            <div className="forgot">
              <a href="#">Forgot Password?</a>
            </div>

            <button className="login-btn">Log In</button>

            <p className="terms">
              By proceeding, you agree to our Terms and acknowledge our Privacy Policy
            </p>

            <p className="signup">
              Don’t have an account? <span><a href="/Spi_Tractors_Signup">Sign-up</a></span>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
            {slides.map((slide, index) => (
            <div
                key={index}
                className={`carousel-slide ${
                    index === currentSlide ? "active" : ""
                }`}
                >
                <img src={slide.image} alt="" className="bg-image" />
                <div className="overlay"></div>

                <div className="right-content">
                    <div className="dots">
                    {slides.map((_, i) => (
                        <span
                        key={i}
                        className={i === currentSlide ? "active" : ""}
                        onClick={() => setCurrentSlide(i)}
                        />
                    ))}
                    </div>

                    <h2>{slide.title}</h2>
                    <p>{slide.text}</p>
                </div>
            </div>
            ))}
        </div>

    </div>
  );
}
