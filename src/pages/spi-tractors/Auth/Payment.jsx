import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";
import img from "../../../assets/images/spitractors/card.png"

export default function Payment() {
  const navigate = useNavigate();

  const [plan, setPlan] = useState("monthly"); // monthly | yearly
  const [method, setMethod] = useState("card"); // card (for now)
  const [agree, setAgree] = useState(false);

  return (
    <div className="payment-page">
      <div className="payment-back" onClick={() => navigate(-1)} aria-label="Back">
        ←
      </div>

      <div className="payment-container">
        <h1>Create Your Spida Account</h1>
        <p className="payment-subtitle">
          Sign up to access affordable mechanization services and optimize your farming.
        </p>

        {/* Plan cards */}
        <div className="plan-row">
          <div
            type="button"
            className={`plan-card ${plan === "monthly" ? "active" : ""}`}
            onClick={() => setPlan("monthly")}
          >
            <div className="plan-left">
              <div className="plan-label">Monthly Plan</div>
              <div className="plan-price">₦5,000/month</div>
            </div>

            <div className={`plan-check ${plan === "monthly" ? "on" : ""}`}>
              {plan === "monthly" ? "✓" : ""}
            </div>
          </div>

          <div
            type="button"
            className={`plan-card muted ${plan === "yearly" ? "active" : ""}`}
            onClick={() => setPlan("yearly")}
          >
            <div className="plan-left">
              <div className="plan-label">Yearly Plan</div>
              <div className="plan-price light">₦3,500/month</div>
            </div>

            <div className={`plan-check ${plan === "yearly" ? "on" : ""}`}>
              {plan === "yearly" ? "✓" : ""}
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="section-title">Select Payment method</div>

        <div
          type="button"
          className={`method-pill ${method === "card" ? "active" : ""}`}
          onClick={() => setMethod("card")}
        >
          <span className="method-check">{method === "card" ? "✓" : ""}</span>
          <span className="method-icon" aria-hidden="true">
            <img src={img} />
          </span>
          <span className="method-text">Pay with card</span>
        </div>

        {/* Form fields */}
        <div className="payment-form">
          <div className="field">
            <label>Card Name</label>
            <input placeholder="Monica Feeney" />
          </div>

          <div className="field">
            <label>Card Numebr</label>
            <input placeholder="205-293-6138-293" />
          </div>

          <div className="field">
            <label>Valid Till</label>
            <input placeholder="25/24" />
          </div>

          <div className="field">
            <label>CVV</label>
            <input placeholder="999" />
          </div>

          <div className="field">
            <label>Email Address</label>
            <input placeholder="Lilliana70@yahoo.com" />
          </div>

          <div className="field">
            <label>Billing Address (Optional)</label>
            <input placeholder="Schedules" />
          </div>
        </div>

        {/* Agreement */}
        <div className="agreement">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <p>
            By selecting the checkbox, you are indicating your agreement to our Terms of Use
            and Privacy Statement. Spida will seamlessly maintain your subscription, and you
            retain the flexibility to cancel at any point.
          </p>
        </div>

        {/* CTA */}
        <button className="pay-btn" disabled={!agree} onClick={() => navigate("/Spi_Tractors-Subscription-Sucess/")}>
          Make Payment
        </button>
      </div>
    </div>
  );
}
