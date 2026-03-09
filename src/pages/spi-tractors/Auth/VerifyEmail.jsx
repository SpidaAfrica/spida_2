import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerifyEmail.css";
import img from "../../../assets/images/spitractors/sms-star.png";
import { spiTractorsApi, getEmailVerifyToken } from "../api/spiTractorsApi";

const OTP_LEN = 6;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [code, setCode] = useState(Array.from({ length: OTP_LEN }, () => ""));
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const inputsRef = useRef(new Array(OTP_LEN).fill(null));

  useEffect(() => {
    inputsRef.current[0]?.focus();

    // DEV convenience: autofill otp from localStorage if available
    const devOtp = (getEmailVerifyToken?.() || "").replace(/\D/g, "").slice(0, OTP_LEN);
    if (devOtp.length === OTP_LEN) {
      const next = Array.from({ length: OTP_LEN }, (_, i) => devOtp[i] || "");
      setCode(next);
      inputsRef.current[OTP_LEN - 1]?.focus();
    }
  }, []);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < OTP_LEN - 1) {
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
      if (index > 0) inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LEN - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
    if (!pasted) return;

    const next = Array.from({ length: OTP_LEN }, () => "");
    pasted.split("").forEach((d, i) => {
      if (i < OTP_LEN) next[i] = d;
    });
    setCode(next);

    const focusIndex = Math.min(pasted.length, OTP_LEN) - 1;
    inputsRef.current[focusIndex]?.focus();
  };

  const handleResend = async () => {
    // This endpoint is a placeholder until you create verify_email_send.php.
    // If you want, tell me and I’ll generate the PHP file.
    try {
      setSending(true);
      const res = await spiTractorsApi.sendVerifyEmailCode();

      // Our API returns: { success, message, data: {...} }
      // In dev you might return the code again as data.email_verification_token
      alert(res?.message || "Code sent");
    } catch (error) {
      alert(error?.message || "Unable to resend code");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    const otp = code.join("").replace(/\D/g, "");

    if (otp.length !== OTP_LEN) {
      alert(`Please enter the ${OTP_LEN}-digit code.`);
      return;
    }

    try {
      setLoading(true);
      const res = await spiTractorsApi.confirmVerifyEmail(otp);

      if (!res?.success) {
        throw new Error(res?.message || "Verification failed");
      }

      navigate("/Spi_Tractors-Email-Verified/", { state: { email } });
    } catch (error) {
      alert(error?.message || "Verification failed");
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

        {/* Hide resend until endpoint exists, OR keep it if you create verify_email_send.php */}
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
