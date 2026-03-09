import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Auth/VerifyEmail.css"; // reuse same OTP styling

export default function GuestLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  // optional: pass request draft from request page
  const requestDraft = location.state?.requestDraft || null;

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const onContinue = () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }

    // Move to OTP screen
    navigate("/Spi_Tractors-Otp/", {
      state: {
        phone,
        next: "/Spi_Tractors-Request/", // return here after login
        requestDraft, // pass request details so user doesn't refill
      },
    });
  };

  return (
    <div className="verify-page">
      <div className="verify-center">
        <h2 className="email-verified-title">
          Continue with Phone
        </h2>

        <p className="email-verified-text">
          Enter your phone number to receive a verification code.
        </p>

        <div style={{ width: "100%", marginTop: "20px" }}>
          <input
            type="tel"
            placeholder="e.g 08012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="otp-box"
            style={{
              width: "100%",
              height: "50px",
              textAlign: "left",
              padding: "0 10px",
            }}
          />
        </div>

        <button
          className="verify-btn"
          onClick={onContinue}
          disabled={loading}
          style={{ marginTop: "20px" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
