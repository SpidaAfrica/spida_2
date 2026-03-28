import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import back from "../../../../assets/images/icons/backarrow.png";
import forward from "../../../../assets/images/icons/frontarrow.png";
import fruits from "../../../../assets/images/product/fruits.png";

import "./verify.css";

const Verify = () => {
  const inputsRef = useRef([]);
  const { accountType } = useParams();
  const navigate = useNavigate();

  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // ✅ USE PHONE (NOT EMAIL)
  const phone = sessionStorage.getItem(`${accountType}Phone`);

  // ✅ Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // ✅ Session check
  useEffect(() => {
    if (!phone) {
      setMessage("Session expired! Please register again.");
    }
  }, [phone]);

  // ✅ Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // ✅ Handle paste (premium UX)
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtpValues(newOtp);

    // Fill inputs visually
    newOtp.forEach((val, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = val;
      }
    });

    // Auto submit
    setTimeout(() => handleVerifyOTP(newOtp.join("")), 300);
  };

  // ✅ Input change
  const handleInputChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");

    if (!value) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Move forward
    if (index < 5) {
      inputsRef.current[index + 1].focus();
    }

    // Auto submit if last digit
    if (index === 5) {
      const finalOtp = [...newOtpValues].join("");
      handleVerifyOTP(finalOtp);
    }
  };

  // ✅ Backspace handling
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otpValues[index]) {
        const newOtp = [...otpValues];
        newOtp[index] = "";
        setOtpValues(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOTP = async (otpOverride = null) => {
    if (!phone) {
      setMessage("Session expired! Please register again.");
      return;
    }

    const otp = otpOverride || otpValues.join("");

    if (otp.length !== 6) {
      setMessage("Enter complete OTP");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `https://api.spida.africa/${accountType}/verify_${accountType}.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp, phone }),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        navigate(`/registration-completed/${accountType}`);
      } else {
        setError(result.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESEND OTP (with cooldown)
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    try {
      const response = await fetch(
        `https://api.spida.africa/${accountType}/resend_otp.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setMessage(result.message);
        setError("");
        setResendTimer(60); // restart timer
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="verify_otp_page">
      <div className="">
        <h1>Verify Your Account</h1>
        <p>
          We've sent a One-Time Password (OTP) to your phone number. Please
          enter the OTP below to verify your account.
        </p>

        <div className="otp_fields" onPaste={handlePaste}>
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="otp_input"
              value={otpValues[index]}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {message && <p className="error">{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="no_otp_sent">
          <p>
            Didn't receive the OTP?{" "}
            <span
              onClick={handleResendOTP}
              style={{
                opacity: resendTimer > 0 ? 0.5 : 1,
                pointerEvents: resendTimer > 0 ? "none" : "auto",
              }}
            >
              {resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend OTP"}
            </span>
          </p>
        </div>

        <div className="verify_actions">
          <div className="">
            <button onClick={handleGoBack} className="back">
              <img src={back} alt="" />
              <span>Go Back</span>
            </button>

            <button
              onClick={() => handleVerifyOTP()}
              className="verify"
              disabled={loading}
            >
              <span>{loading ? "Verifying..." : "Verify OTP"}</span>
              <img src={forward} alt="" />
            </button>
          </div>
        </div>

        <h4>Need help? Visit our Help Center or Contact Support</h4>
      </div>

      <div className="flower">
        <img src={fruits} alt="" className="fruits" />
      </div>
    </div>
  );
};

export default Verify;
