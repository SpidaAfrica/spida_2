import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";
import img from "../../../assets/images/spitractors/card.png";
import { spiTractorsApi, getCurrentUser } from "../api/spiTractorsApi";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [plan, setPlan] = useState("monthly"); // monthly | yearly
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = getCurrentUser();
  const email = user?.email || location.state?.email || "";

  // Display-only pricing (backend is the source of truth)
  const pricing = useMemo(() => {
    const monthly = 5000;
    const yearlyTotal = 3500 * 12; // ₦42,000/year
    return {
      monthly: { title: "Monthly Plan", sub: "₦5,000/month", amountNaira: monthly },
      yearly: { title: "Yearly Plan", sub: "₦3,500/month", amountNaira: yearlyTotal, note: "Billed yearly (₦42,000)" },
    };
  }, []);

  // 1) After Paystack redirects back, it appends ?reference=xxxx
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get("reference");
    if (!reference) return;

    (async () => {
      try {
        setLoading(true);

        // Verify transaction on backend
        const res = await spiTractorsApi.paymentVerify(reference);

        if (!res?.success) {
          throw new Error(res?.message || "Unable to verify payment");
        }

        // Go to success page
        navigate("/Spi_Tractors-Subscription-Sucess/", {
          replace: true,
          state: { email, reference, plan: res?.data?.plan || plan },
        });
      } catch (e) {
        alert(e?.message || "Payment verification failed. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // 2) Start payment: initialize Paystack and redirect to authorization_url
  const startPayment = async () => {
    if (loading) return;

    if (!agree) {
      alert("Please accept the terms to continue.");
      return;
    }

    if (!email) {
      alert("Missing email. Please go back and complete registration.");
      return;
    }

    try {
      setLoading(true);

      // backend will calculate amount based on plan (more secure)
      const res = await spiTractorsApi.paymentIntent({
        email,
        plan, // monthly | yearly
      });

      const authUrl = res?.data?.authorization_url;
      if (!authUrl) {
        throw new Error(res?.message || "Unable to start Paystack payment");
      }

      window.location.href = authUrl; // Redirect to Paystack Checkout
    } catch (e) {
      alert(e?.message || "Unable to start payment");
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-back" onClick={() => navigate(-1)} aria-label="Back">
        ←
      </div>

      <div className="payment-container">
        <h1>Activate Subscription</h1>
        <p className="payment-subtitle">
          Choose a plan and complete payment with Paystack to activate your Spida subscription.
        </p>

        {/* Plan cards */}
        <div className="plan-row">
          <div
            role="button"
            className={`plan-card ${plan === "monthly" ? "active" : ""}`}
            onClick={() => setPlan("monthly")}
          >
            <div className="plan-left">
              <div className="plan-label">{pricing.monthly.title}</div>
              <div className="plan-price">{pricing.monthly.sub}</div>
            </div>
            <div className={`plan-check ${plan === "monthly" ? "on" : ""}`}>
              {plan === "monthly" ? "✓" : ""}
            </div>
          </div>

          <div
            role="button"
            className={`plan-card muted ${plan === "yearly" ? "active" : ""}`}
            onClick={() => setPlan("yearly")}
          >
            <div className="plan-left">
              <div className="plan-label">{pricing.yearly.title}</div>
              <div className="plan-price light">{pricing.yearly.sub}</div>
              {pricing.yearly.note ? (
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                  {pricing.yearly.note}
                </div>
              ) : null}
            </div>
            <div className={`plan-check ${plan === "yearly" ? "on" : ""}`}>
              {plan === "yearly" ? "✓" : ""}
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="section-title">Payment method</div>

        <div className="method-pill active">
          <span className="method-check">✓</span>
          <span className="method-icon" aria-hidden="true">
            <img src={img} alt="paystack" />
          </span>
          <span className="method-text">Paystack (Card / Bank / USSD)</span>
        </div>

        {/* Show Email + Amount (display only) */}
        <div className="payment-form">
          <div className="field">
            <label>Email Address</label>
            <input value={email} readOnly placeholder="Your email" />
          </div>

          <div className="field">
            <label>Amount</label>
            <input
              value={
                plan === "monthly"
                  ? "₦5,000"
                  : "₦42,000"
              }
              readOnly
            />
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
            By selecting the checkbox, you agree to our Terms of Use and Privacy Statement.
            Spida will maintain your subscription, and you can cancel at any point.
          </p>
        </div>

        {/* CTA */}
        <button className="pay-btn" disabled={!agree || loading} onClick={startPayment}>
          {loading ? "Processing..." : "Pay with Paystack"}
        </button>
      </div>
    </div>
  );
}
