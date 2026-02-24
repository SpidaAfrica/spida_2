import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { spiTractorsApi } from "../api/spiTractorsApi";

const PENDING_PAY_KEY = "spiPendingPaystackPayment";

export default function SpiTractorsPayCallback() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Verifying payment...");

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const reference = url.searchParams.get("reference");

        const pending = JSON.parse(localStorage.getItem(PENDING_PAY_KEY) || "null");

        const ref = reference || pending?.reference;
        if (!ref) throw new Error("Missing Paystack reference.");

        // verify on backend
        const verifyRes = await spiTractorsApi.paystackVerify(referenceString);

        if (!verifyRes?.success) throw new Error(verifyRes?.message || "Payment verification failed");

        // clean pending
        localStorage.removeItem(PENDING_PAY_KEY);

        // go to tracking
        navigate("/SpiTractorsTrackRequest", {
          replace: true,
          state: {
            requestId: pending?.requestId || "",
            requestUuid: pending?.requestUuid || "",
            tractorName: pending?.tractorName || "",
            service: pending?.service || "",
            farmAddress: pending?.farmAddress || "",
            distanceKm: pending?.distanceKm || 0,
            etaMinutes: pending?.etaMinutes || 0,
          },
        });
      } catch (e) {
        setMsg(e?.message || "Unable to verify payment.");
      }
    };

    run();
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h2>{msg}</h2>
      <p>If this stays here, go back and try again.</p>
    </div>
  );
}
