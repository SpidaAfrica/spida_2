import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { spiTractorsApi } from "../api/spiTractorsApi";

const PENDING_PAY_KEY = "spiPendingPaystackPayment";
const TRACK_REQUEST_KEY = "spiTrackRequestId";

export default function SpiTractorsPayCallback() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Verifying payment...");

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const reference = url.searchParams.get("reference");

        const pending = JSON.parse(
          localStorage.getItem(PENDING_PAY_KEY) || "null"
        );

        const ref = reference || pending?.reference;
        if (!ref) throw new Error("Missing Paystack reference.");

        setMsg("Verifying payment with Paystack...");

        // ✅ verify payment only
        const verifyRes = await spiTractorsApi.paystackVerify(ref);

        if (!verifyRes?.success) {
          throw new Error(
            verifyRes?.message || "Payment verification failed"
          );
        }

        // ✅ pairing now happens in backend (paystack_verify.php)
        setMsg("Payment successful. Preparing tracking...");

        // Save requestId for tracking
        if (pending?.requestId) {
          localStorage.setItem(
            TRACK_REQUEST_KEY,
            JSON.stringify({
              requestId: pending.requestId,
            })
          );
        }

        localStorage.removeItem(PENDING_PAY_KEY);

        // ✅ go to tracking page
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
        console.error("Payment verify error:", e);
        setMsg(e?.message || "Unable to verify payment.");
      }
    };

    run();
  }, [navigate]);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>{msg}</h2>
      <p>If this stays here, try refreshing or go back and try again.</p>
    </div>
  );
}
