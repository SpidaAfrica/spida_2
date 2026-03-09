import { useNavigate, useLocation } from "react-router-dom";
import "./EmailVerified.css";

export default function EmailVerified() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "lovethstone@gmail.com";
  

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
            <circle
              cx="55"
              cy="55"
              r="38"
              stroke="#3FAE4B"
              strokeWidth="4"
            />
            <path
              d="M42 56L51 65L70 46"
              stroke="#B7E1BE"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="email-verified-title">Email Verified</h2>

        <p className="email-verified-text">
          We have sent a code to{" "}
          <span className="email-verified-email">{email}</span> to confirm the
          validity
        </p>

        <button
          className="email-verified-btn"
          onClick={() => navigate("/Spi_Tractors-Subscription/", { state: { email } })}
        >
          Continue Registration
        </button>
      </div>
    </div>
  );
}
