import { useNavigate } from "react-router-dom";
import "./SubscriptionSuccess.css";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();

  return (
    <div className="sub-success-page">
      <div
        className="sub-success-back"
        onClick={() => navigate(-1)}
        aria-label="Back"
      >
        ←
      </div>

      <div className="sub-success-center">
        <div className="sub-success-icon" aria-hidden="true">
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

        <h2 className="sub-success-title">Subscription Successful</h2>
        <p className="sub-success-text">
          Your Spida Premium plan is now active.
        </p>

        <button
          className="sub-success-btn"
          onClick={() => navigate("/Spi_Tractors-AddTractor/")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
