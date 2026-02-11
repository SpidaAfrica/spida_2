import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerifyEmail.css";
import img from "../../../assets/images/spitractors/sms-star.png";
import { spiTractorsApi } from "../api/spiTractorsApi";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const inputsRef = useRef(new Array(4).fill(null));

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const next = [...code];
        next[index] = "";
        setCode(next);
        return;
      }
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;

    const next = ["", "", "", ""];
    pasted.split("").forEach((d, i) => {
      if (i < 4) next[i] = d;
    });
    setCode(next);

    const focusIndex = Math.min(pasted.length, 4) - 1;
    inputsRef.current[focusIndex]?.focus();
  };

  const handleResend = async () => {
    try {
      setSending(true);
      const res = await spiTractorsApi.sendVerifyEmailCode();
      alert(`Code sent. Demo token: ${res?.data?.token || "generated"}`);
    } catch (error) {
      alert(error.message || "Unable to resend code");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    const otp = code.join("");
    if (otp.length < 4) {
      alert("Please enter the 4-digit code.");
      return;
    }

    try {
      setLoading(true);
      await spiTractorsApi.confirmVerifyEmail(otp);
      navigate("/Spi_Tractors-Email-Verified/", { state: { email } });
    } catch (error) {
      alert(error.message || "Verification failed");
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
          <img src={img} alt="verification" />
        </div>

        <p className="verify-text">
          We have sent a code to <span className="verify-email">{email || "your email"}</span> to confirm validity.
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

        <div className="resend" onClick={handleResend}>
          {sending ? "Sending..." : "Resend code"}
        </div>

        <button className="verify-btn" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </div>
    </div>
  );
}
