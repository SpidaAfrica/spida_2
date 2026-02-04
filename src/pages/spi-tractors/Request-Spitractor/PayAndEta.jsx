import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PayAndEta.css";

export default function SpiTractorsPayAndEta() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // You can pass these from the previous page via navigate("/pay", { state: {...} })
  const job = useMemo(() => {
    return (
      state?.job || {
        requestId: "REQ-4567",
        service: "Ploughing",
        farmAddress: "12 Banana Street, Lekki, Lagos, Nigeria",
        farmSize: "10 acres",
        tractorName: "Greenfield 6060X",
        tractorRegId: "ABC-456ZT",
        distanceKm: 6.4, // tractor -> farm
        etaMinutes: 18, // travel time
        ratePerHour: 5000, // ₦
        estimatedHours: 6, // job duration
        travelFee: 2000, // ₦
      }
    );
  }, [state]);

  const [paymentMethod, setPaymentMethod] = useState("card");

  const total = useMemo(() => {
    const workCost = job.ratePerHour * job.estimatedHours;
    return workCost + job.travelFee;
  }, [job]);

  const formatMoney = (n) => `₦${Number(n).toLocaleString()}`;

  const handlePay = () => {
    // Demo payment flow:
    // 1) call backend/paystack/flutterwave/etc
    // 2) on success navigate to tracking page with requestId

    navigate("/SpiTractorsTrackRequest", {
      state: {
        requestId: job.requestId,
        tractorName: job.tractorName,
        service: job.service,
        farmAddress: job.farmAddress,
        distanceKm: job.distanceKm,
        etaMinutes: job.etaMinutes,
      },
    });
  };

  return (
    <div className="pay-page">
      <button className="pay-back" onClick={() => navigate(-1)} aria-label="Go back">
        ←
      </button>

      <div className="pay-shell">
        <header className="pay-head">
          <h1 className="pay-title">Payment & ETA</h1>
          <p className="pay-subtitle">
            Review your request, confirm pricing, then proceed to payment.
          </p>
        </header>

        <div className="pay-grid">
          {/* LEFT: Details */}
          <div className="pay-card">
            <div className="pay-rowTop">
              <div>
                <div className="pay-chip">{job.requestId}</div>
                <h2 className="pay-h2">{job.service}</h2>
                <p className="pay-muted">{job.farmAddress}</p>
              </div>

              <div className="pay-tractor">
                <div className="pay-tractorName">{job.tractorName}</div>
                <div className="pay-tractorMeta">Reg. ID: {job.tractorRegId}</div>
              </div>
            </div>

            {/* Map + distance */}
            <div className="pay-mapWrap">
              <div className="pay-map">
                {/* Placeholder map — replace later with real map */}
                <div className="pay-pin pay-pinFarm" title="Farm" />
                <div className="pay-pin pay-pinTractor" title="Tractor" />
                <div className="pay-path" />
              </div>

              <div className="pay-etaCard">
                <div className="pay-etaItem">
                  <div className="pay-etaLabel">Distance</div>
                  <div className="pay-etaValue">{job.distanceKm} km</div>
                </div>
                <div className="pay-etaItem">
                  <div className="pay-etaLabel">Arrival (ETA)</div>
                  <div className="pay-etaValue">{job.etaMinutes} mins</div>
                </div>
                <div className="pay-etaItem">
                  <div className="pay-etaLabel">Est. Job Time</div>
                  <div className="pay-etaValue">{job.estimatedHours} hrs</div>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="pay-section">
              <h3 className="pay-sectionTitle">Pricing</h3>

              <div className="pay-breakdown">
                <div className="pay-line">
                  <span>Hourly rate</span>
                  <b>{formatMoney(job.ratePerHour)}/hr</b>
                </div>

                <div className="pay-line">
                  <span>Estimated duration</span>
                  <b>{job.estimatedHours} hrs</b>
                </div>

                <div className="pay-line">
                  <span>Work cost</span>
                  <b>{formatMoney(job.ratePerHour * job.estimatedHours)}</b>
                </div>

                <div className="pay-line">
                  <span>Travel fee</span>
                  <b>{formatMoney(job.travelFee)}</b>
                </div>

                <div className="pay-divider" />

                <div className="pay-total">
                  <span>Total</span>
                  <b>{formatMoney(total)}</b>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Payment */}
          <div className="pay-card pay-right">
            <h3 className="pay-sectionTitle">Payment Method</h3>

            <div className="pay-methods">
              <button
                type="button"
                className={`pay-method ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <span className="pay-check">{paymentMethod === "card" ? "✓" : ""}</span>
                <span>Pay with card</span>
              </button>

              <button
                type="button"
                className={`pay-method ${paymentMethod === "wallet" ? "active" : ""}`}
                onClick={() => setPaymentMethod("wallet")}
              >
                <span className="pay-check">{paymentMethod === "wallet" ? "✓" : ""}</span>
                <span>Spida Wallet</span>
              </button>
            </div>

            <div className="pay-note">
              By proceeding, you confirm this estimate. Final cost may adjust slightly based on
              actual work duration.
            </div>

            <button className="pay-btn" onClick={handlePay} type="button">
              Make Payment
            </button>

            <button
              className="pay-secondary"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
