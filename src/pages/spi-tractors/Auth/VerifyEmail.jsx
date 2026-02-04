import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifyEmail.css";
import img from "../../../assets/images/spitractors/sms-star.png";

type Props = {
  email?: string;
};

export default function VerifyEmail({ email = "lovethstone@gmail.com" }: Props) {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", ""]);
  const inputsRef = useRef(new Array(4).fill(null));

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Allow only one digit
    const digit = value.replace(/\D/g, "").slice(0, 1);

    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        // clear current
        const next = [...code];
        next[index] = "";
        setCode(next);
        return;
      }
      // move back
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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
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

  const handleResend = () => {
    // TODO: call backend resend endpoint
    alert("Code resent (hook to backend).");
  };

  /*const handleVerify = () => {
    const otp = code.join("");
    if (otp.length < 4) {
      alert("Please enter the 4-digit code.");
      return;
    }

    // TODO: verify OTP with backend
    alert(`Verifying: ${otp} (hook to backend)`);

    // Example next route:
    // navigate("/dashboard");
  };*/

  return (
    <div className="verify-page">
      <div className="verify-back" onClick={() => navigate(-1)} aria-label="Back">
        ←
      </div>

      <div className="verify-center">
        {/* Icon */}
        <div className="verify-icon" aria-hidden="true">
          <img src={img}/>
        </div>

        <p className="verify-text">
          We have sent a code to{" "}
          <span className="verify-email">{email}</span> to confirm the validity
        </p>

        {/* OTP boxes */}
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
          Resend code
        </div>

        <button className="verify-btn" onClick={navigate("/Spi_Tractors-Email-Verified/")}>
          Verify Email
        </button>
      </div>
    </div>
  );
}
