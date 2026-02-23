import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PayAndEta.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

const PENDING_PAY_KEY = "spiPendingPaystackPayment";

export default function SpiTractorsPayAndEta() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const job = useMemo(() => {
    return (
      state?.job || {
        requestId: "REQ-4567",
        requestUuid: "",
        service: "Ploughing",
        farmAddress: "12 Banana Street, Lekki, Lagos, Nigeria",
        farmCity: "Lagos",
        farmSize: 10,
        tractorId: "",
        tractorName: "Greenfield 6060X",
        tractorRegId: "ABC-456ZT",
        distanceKm: 6.4,
        etaMinutes: 18,
        ratePerHour: 5000,
        estimatedHours: 6,
        travelFee: 2000,
        full_name: "",
        farm_name: "",
      }
    );
  }, [state]);

  const [paymentMethod, setPaymentMethod] = useState("card"); // card | wallet (later)
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const runEstimate = async () => {
      try {
        const res = await spiTractorsApi.paymentEstimate({
          rate_per_hour: job.ratePerHour,
          estimated_hours: job.estimatedHours,
          travel_fee: job.travelFee,
        });
        setEstimate(res?.data || null);
      } catch {
        setEstimate(null);
      }
    };

    runEstimate();
  }, [job.estimatedHours, job.ratePerHour, job.travelFee]);

  useEffect(() => {
    if (paymentMethod !== "wallet") return;
    spiTractorsApi
      .walletMe()
      .then((res) => setWallet(res?.data || null))
      .catch(() => setWallet(null));
  }, [paymentMethod]);

  const total = useMemo(() => {
    if (estimate?.total) return Number(estimate.total) || 0;
    return Number(job.ratePerHour) * Number(job.estimatedHours) + Number(job.travelFee);
  }, [estimate, job]);

  const formatMoney = (n) => `₦${Number(n || 0).toLocaleString()}`;

  const handlePay = async () => {
    if (loading) return;

    // You need requestUuid to tie payment to a request
    if (!job.requestUuid) {
      alert("Missing request ID. Please go back and create request again.");
      return;
    }

    if (paymentMethod !== "card") {
      alert("Wallet payments not wired yet. Select Pay with card.");
      return;
    }

    try {
      setLoading(true);

      // Paystack expects kobo
      const amountKobo = Math.round(Number(total) * 100);

      // Where Paystack should redirect after payment.
      // This is a FRONTEND route. Example: https://spida.africa/SpiTractorsPayCallback
      const callbackUrl = `${window.location.origin}/SpiTractorsPayCallback`;

      const initRes = await spiTractorsApi.paystackInitialize({
        job_request_id: job.requestUuid,
        amount_kobo: amountKobo,
        callback_url: callbackUrl,

        // optional meta for your DB / tracking
        meta: {
          request_code: job.requestId,
          tractor_id: job.tractorId || null,
          tractor_reg_id: job.tractorRegId || "",
          service: job.service,
          farm_city: job.farmCity || "",
          farm_address: job.farmAddress || "",
          full_name: job.full_name || "",
          farm_name: job.farm_name || "",
        },
      });

      const authorizationUrl = initRes?.data?.authorization_url;
      const reference = initRes?.data?.reference;

      if (!authorizationUrl || !reference) {
        console.log("paystack_initialize response:", initRes);
        throw new Error("Unable to start Paystack payment (missing authorization_url/reference).");
      }

      // store pending payment so callback screen can verify + route correctly
      localStorage.setItem(
        PENDING_PAY_KEY,
        JSON.stringify({
          reference,
          requestUuid: job.requestUuid,
          requestId: job.requestId,
          tractorName: job.tractorName,
          service: job.service,
          farmAddress: job.farmAddress,
          distanceKm: job.distanceKm,
          etaMinutes: job.etaMinutes,
        })
      );

      // redirect to Paystack checkout
      window.location.href = authorizationUrl;
    } catch (error) {
      alert(error?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pay-page">
      <button className="pay-back" onClick={() => navigate(-1)} aria-label="Go back">
        ←
      </button>

      <div className="pay-shell">
        <header className="pay-head">
          <h1 className="pay-title">Payment & ETA</h1>
          <p className="pay-subtitle">Review your request, confirm pricing, then proceed to payment.</p>
        </header>

        <div className="pay-grid">
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

            <div className="pay-mapWrap">
              <div className="pay-map">
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

          <div className="pay-card pay-right">
            <h3 className="pay-sectionTitle">Payment Method</h3>

            <div className="pay-methods">
              <button
                type="button"
                className={`pay-method ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <span className="pay-check">{paymentMethod === "card" ? "✓" : ""}</span>
                <span>Pay with Paystack (card/bank/USSD)</span>
              </button>
            </div>

            {wallet && (
              <div className="pay-note">
                Wallet Balance: <b>{formatMoney(wallet.available_balance || 0)}</b>
              </div>
            )}

            <div className="pay-note">
              By proceeding, you confirm this estimate. Final cost may adjust slightly based on actual work duration.
            </div>

            <button className="pay-btn" onClick={handlePay} type="button" disabled={loading}>
              {loading ? "Redirecting to Paystack..." : "Make Payment"}
            </button>

            <button className="pay-secondary" type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
