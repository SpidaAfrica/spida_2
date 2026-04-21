import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import img1 from "../../../assets/images/spitractors/img1.png";
import img2 from "../../../assets/images/spitractors/img2.png";
import img3 from "../../../assets/images/spitractors/img3.png";
import img4 from "../../../assets/images/spitractors/img4.png";
import logo from "../../../assets/images/logo2.png";
import { saveSession, spiTractorsApi } from "../api/spiTractorsApi";

/* Password rules */
const PASSWORD_RULES = [
  { label: "At least 6 characters",   test: (p) => p.length >= 6 },
  { label: "One uppercase letter",     test: (p) => /[A-Z]/.test(p) },
  { label: "One number",               test: (p) => /[0-9]/.test(p) },
  { label: "One special character",    test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function validatePassword(password) {
  return PASSWORD_RULES.every((r) => r.test(password));
}

export default function Spi_Tractors_Login() {
  const navigate = useNavigate();

  const slides = [
    { image: img1, title: "Boosted yields and improved food security",   text: "Mechanized farming boosts yields, contributing to improved food security and livelihoods." },
    { image: img2, title: "Access to modern farming equipment",           text: "Farmers gain access to reliable machinery that reduces manual labor and increases efficiency." },
    { image: img3, title: "Higher profitability for farmers",             text: "Lower costs and higher output translate into better income for farmers." },
    { image: img4, title: "Sustainable agricultural growth",              text: "Smart mechanization supports long-term agricultural sustainability." },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [email,        setEmail]         = useState("");
  const [password,     setPassword]      = useState("");
  const [showPassword, setShowPassword]  = useState(false);
  const [pwdFocused,   setPwdFocused]    = useState(false);
  const [loading,      setLoading]       = useState(false);
  const [pwdError,     setPwdError]      = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goAfterLogin = (user) => {
    const role = String(user?.role || "").toUpperCase();
    if (role === "TRACTOR_OWNER" || role === "ADMIN") {
      navigate("/Spi_Tractors-Dashboard", { replace: true });
      return;
    }
    navigate("/Spi_Tractors-Request/", { replace: true });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass  = password;

    if (!cleanEmail || !cleanPass) {
      alert("Enter email and password");
      return;
    }

    /* Password validation */
    if (!validatePassword(cleanPass)) {
      setPwdError("Password must be at least 6 characters and include an uppercase letter, a number, and a special character.");
      return;
    }

    setPwdError("");

    try {
      setLoading(true);
      const res   = await spiTractorsApi.login({ email: cleanEmail, password: cleanPass });
      const user  = res?.data?.user;
      const token = res?.data?.token;

      if (!user || !token) throw new Error("Login succeeded but token/user missing.");

      saveSession(user, token);
      goAfterLogin(user);
    } catch (error) {
      alert(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onForgotPassword = async () => {
    const forgotEmail = window.prompt("Enter your account email:", email.trim().toLowerCase());
    if (!forgotEmail) return;

    try {
      const sendRes  = await spiTractorsApi.forgotPassword({ email: forgotEmail.trim().toLowerCase() });
      const demoToken = sendRes?.data?.token || "";
      const token    = window.prompt("Enter reset token:", demoToken);
      if (!token) return;

      const newPassword = window.prompt("Enter your new password (min 6 chars, uppercase, number, special char):");
      if (!newPassword || !validatePassword(newPassword)) {
        alert("Password must be at least 6 characters and include an uppercase letter, a number, and a special character.");
        return;
      }

      await spiTractorsApi.resetPassword({ token, new_password: newPassword });
      alert("Password reset successful. You can now log in.");
    } catch (error) {
      alert(error?.message || "Unable to reset password");
    }
  };

  /* Password strength indicator */
  const pwdStrength = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwdStrength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#16a34a"][pwdStrength];

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-wrapper">
          <img src={logo} alt="SPIDA" className="logo" />

          <form className="login-card" onSubmit={onSubmit}>
            <h1 className="title">
              Welcome Back to <span>SpiTractors!</span>
            </h1>
            <p className="subtitle">
              Log in to continue boosting yields and improving profitability with mechanized farming.
            </p>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            {/* Password field with eye toggle */}
            <div className="pwd-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwdError(""); }}
                onFocus={() => setPwdFocused(true)}
                onBlur={() => setPwdFocused(false)}
                autoComplete="current-password"
                className={pwdError ? "pwd-input pwd-input-error" : "pwd-input"}
              />
              <button
                type="button"
                className="pwd-eye"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* Eye-off icon */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  /* Eye icon */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Password strength (shown while typing) */}
            {password.length > 0 && (
              <div className="pwd-strength">
                <div className="pwd-strength-bar">
                  {PASSWORD_RULES.map((_, i) => (
                    <div
                      key={i}
                      className="pwd-strength-seg"
                      style={{ background: i < pwdStrength ? strengthColor : "#e5e7eb" }}
                    />
                  ))}
                </div>
                <div className="pwd-strength-label" style={{ color: strengthColor }}>
                  {strengthLabel}
                </div>
              </div>
            )}

            {/* Rule hints (shown while focused) */}
            {(pwdFocused || pwdError) && password.length > 0 && (
              <ul className="pwd-rules">
                {PASSWORD_RULES.map((rule) => (
                  <li key={rule.label} className={rule.test(password) ? "pwd-rule ok" : "pwd-rule"}>
                    <span className="pwd-rule-dot">{rule.test(password) ? "✓" : "○"}</span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}

            {pwdError && <p className="pwd-error">{pwdError}</p>}

            <div className="forgot">
              <button
                type="button"
                onClick={onForgotPassword}
                style={{ background: "none", border: "none", color: "#2a63d4", cursor: "pointer", padding: 0 }}
              >
                Forgot Password?
              </button>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>

            <p className="terms">
              By proceeding, you agree to our Terms and acknowledge our Privacy Policy
            </p>

            <p className="signup">
              Don't have an account?{" "}
              <span><a href="/Spi_Tractors_Signup">Sign-up</a></span>
            </p>
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
