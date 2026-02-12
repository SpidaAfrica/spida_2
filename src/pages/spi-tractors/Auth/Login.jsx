import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import img1 from "../../../assets/images/spitractors/img1.png";
import img2 from "../../../assets/images/spitractors/img2.png";
import img3 from "../../../assets/images/spitractors/img3.png";
import img4 from "../../../assets/images/spitractors/img4.png";
import { saveSession, spiTractorsApi } from "../api/spiTractorsApi";

export default function Spi_Tractors_Login() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const slides = [
    { image: img1, title: "Boosted yields and improved food security", text: "Mechanized farming boosts yields, contributing to improved food security and livelihoods." },
    { image: img2, title: "Access to modern farming equipment", text: "Farmers gain access to reliable machinery that reduces manual labor and increases efficiency." },
    { image: img3, title: "Higher profitability for farmers", text: "Lower costs and higher output translate into better income for farmers." },
    { image: img4, title: "Sustainable agricultural growth", text: "Smart mechanization supports long-term agricultural sustainability." },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await spiTractorsApi.login({ email, password });
      const user = res?.data?.user;
      const token = res?.data?.token;
      saveSession(user, token);

      if (user?.role === "TRACTOR_OWNER" || user?.role === "ADMIN") {
        navigate("/Spi_Tractors_Dashboard/");
        return;
      }

      navigate("/Spi_Tractors_Request/");
    } catch (error) {
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onForgotPassword = async () => {
    const forgotEmail = window.prompt("Enter your account email to receive reset token:", email || "");
    if (!forgotEmail) return;

    try {
      const forgotRes = await spiTractorsApi.forgotPassword(forgotEmail);
      const resetToken = forgotRes?.data?.token || window.prompt("Enter reset token:");
      if (!resetToken) return;

      const newPassword = window.prompt("Enter your new password (min 6 chars):");
      if (!newPassword) return;

      await spiTractorsApi.resetPassword({ token: resetToken, new_password: newPassword });
      alert("Password reset successful. You can now log in.");
    } catch (error) {
      alert(error.message || "Unable to reset password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-wrapper">
          <img src="/spida-logo.png" alt="SPIDA" className="logo" />

          <form className="login-card" onSubmit={onSubmit}>
            <h1 className="title">Welcome Back to <span>Spida!</span></h1>
            <p className="subtitle">Log in to continue boosting yields and improving profitability with mechanized farming.</p>
            {/**
            <button className="social-btn" type="button">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              <span style={{ color: "#000" }}>Sign up with Google</span>
            </button>

            <button className="social-btn" type="button">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" />
              <span style={{ color: "#000" }}>Sign up with Facebook</span>
            </button>
            <div className="divider"><span></span><p>OR</p><span></span></div>
            **/}
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div className="forgot">
              <button type="button" onClick={onForgotPassword} style={{ background: "none", border: "none", color: "#2a63d4", cursor: "pointer", padding: 0 }}>
                Forgot Password?
              </button>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>

            <p className="terms">By proceeding, you agree to our Terms and acknowledge our Privacy Policy</p>
            <p className="signup">Don’t have an account? <span><a href="/Spi_Tractors_Signup">Sign-up</a></span></p>
          </form>
        </div>
      </div>

      <div className="login-right">
        {slides.map((slide, index) => (
          <div key={index} className={`carousel-slide ${index === currentSlide ? "active" : ""}`}>
            <img src={slide.image} alt="" className="bg-image" />
            <div className="overlay"></div>
            <div className="right-content">
              <div className="dots">
                {slides.map((_, i) => (
                  <span key={i} className={i === currentSlide ? "active" : ""} onClick={() => setCurrentSlide(i)} />
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
