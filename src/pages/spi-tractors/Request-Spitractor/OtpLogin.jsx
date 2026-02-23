import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Auth/VerifyEmail.css"; // reuse your existing OTP css
import img from "../../../assets/images/spitractors/sms-star.png";
import { spiTractorsApi, saveSession } from "../api/spiTractorsApi";

export default function OtpLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  // Passed from previous screen (Request / GuestLogin)
  const phone = location.state?.phone || "";
  const full_name = location.state?.full_name || "";
  const email = location.state?.email || "";
  const next = location.state?.next || "/";

  const [code, setCode] = useState(["", "", "", "", "", ""]); // ✅ 6
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef(new Array(6).fill(null));

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Auto-send OTP on page load (if phone exists)
  useEffect(() => {
    if (!phone) return;
    handleSendOtp(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);

    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const nextCode = [...code];
        nextCode[index] = "";
        setCode(nextCode);
        return;
      }
      if (index > 0) inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const nextCode = ["", "", "", "", "", ""];
    pasted.split("").forEach((d, i) => {
      if (i < 6) nextCode[i] = d;
    });
    setCode(nextCode);
    inputsRef.current[Math.min(pasted.length, 6) - 1]?.focus();
  };

  const handleSendOtp = async (silent = false) => {
    if (!phone) {
      alert("Missing phone number. Go back and enter your phone.");
      return;
    }

    try {
      setSending(true);
      const res = await spiTractorsApi.otpSend({ phone, full_name, email });

      // Demo otp (backend returns this only in demo mode)
      const demoOtp = res?.data?.demo_otp;

      if (!silent) {
        alert(demoOtp ? `OTP sent. Demo OTP: ${demoOtp}` : "OTP sent.");
      }
    } catch (e) {
      if (!silent) alert(e?.message || "Unable to send OTP");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    const otp = code.join("");
    if (!phone) {
      alert("Missing phone number. Go back.");
      return;
    }
    if (otp.length !== 6) {
      alert("Please enter the 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      const res = await spiTractorsApi.otpVerify({ phone, code: otp });

      const user = res?.data?.user;
      const token = res?.data?.token;

      if (!user || !token) {
        console.log("otp_verify response:", res);
        throw new Error("Login succeeded but token/user missing.");
      }

      saveSession(user, token);
      // after saveSession(user, token);
      const draft = location.state?.requestDraft || null;
      navigate("/Spi_Tractors-Request/", {
        replace: true,
        state: { requestDraft: draft },
      });
    } catch (e) {
      alert(e?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-back" onClick={() => navigate(-1)} aria-label="Back">
        ←
      </div>

      <div className="verify-center">
        <div className="verify-icon" aria-hidden="true">
          <img src={img} alt="otp" />
        </div>

        <p className="verify-text">
          We have sent a code to <span className="verify-email">{phone || "your phone"}</span>.
        </p>

        <div className="otp-row">
          {code.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              className="otp-box"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <div className="resend" onClick={() => !sending && handleSendOtp(false)}>
          {sending ? "Sending..." : "Resend code"}
        </div>

        <button className="verify-btn" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </div>
    </div>
  );
}
