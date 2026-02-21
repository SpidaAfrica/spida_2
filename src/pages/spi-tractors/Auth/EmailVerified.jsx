import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EmailVerified.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

export default function EmailVerified() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "lovethstone@gmail.com";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    if (loading) return;

    const cleanCode = code.replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      alert("Please enter the 6-digit code sent to your email.");
      return;
    }

    try {
      setLoading(true);

      // This must call your backend endpoint:
      // /api/verify_email_confirm.php
      const res = await spiTractorsApi.confirmVerifyEmail(cleanCode);

      if (!res?.success) {
        throw new Error(res?.message || "Verification failed");
      }

      alert("Email verified successfully ✅");
      navigate("/Spi_Tractors-Subscription/", { state: { email } });
    } catch (err) {
      alert(err?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-verified-page">
      <div
        className="email-verified-back"
        onClick={() => navigate(-1)}
        aria-label="Back"
      >
        ←
      </div>

      <div className="email-verified-center">
        {/* Icon */}
        <div className="email-verified-icon" aria-hidden="true">
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
            <circle cx="55" cy="55" r="38" stroke="#3FAE4B" strokeWidth="4" />
            <path
              d="M42 56L51 65L70 46"
              stroke="#B7E1BE"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="email-verified-title">Verify your email</h2>

        <p className="email-verified-text">
          We have sent a <b>6-digit code</b> to{" "}
          <span className="email-verified-email">{email}</span>.
          Enter it below to confirm your account.
        </p>

        {/* OTP Input */}
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter 6-digit code"
          style={{
            width: "100%",
            maxWidth: 320,
            padding: 14,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,.2)",
            background: "rgba(0,0,0,.2)",
            color: "#fff",
            fontSize: 18,
            letterSpacing: 6,
            textAlign: "center",
            outline: "none",
            marginTop: 14,
          }}
        />

        <button
          className="email-verified-btn"
          onClick={onVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        {/* Optional: Resend button when you add resend endpoint */}
        {/* <button className="email-verified-btn" onClick={onResend} disabled={loading}>
          Resend Code
        </button> */}
      </div>
    </div>
  );
}
