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

  const email = sessionStorage.getItem(`${accountType}Email`); // Get email from sessionStorage


  useEffect(() => {
    if (!email) {
      setMessage("Session expired! Please register again.");
    }
  }, [email]);

  const handleResendOTP = async () => {
    alert("I am resending OTP");
    try {
      const response = await fetch(`https://api.spida.africa/${accountType}/resend_otp.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        setError("");
      } else {
        setError(result.error || "Something went wrong!");
        setMessage("");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setMessage("");
    }
  };


  

  const handleVerifyOTP = async () => {
    if (!email) {
      setMessage("Session expired! Please register again.");
      return;
    }
  
    const otp = otpValues.join(""); // Combine all inputs into a 6-digit OTP
    if (otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }
  
    try {
      const response = await fetch(`https://api.spida.africa/${accountType}/verify_${accountType}.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, email }),
      });
  
      const result = await response.json();
      console.log(result);
  
      if (response.ok && result.message) {
        alert(result.message); // Corrected from alert(message)
        navigate(`/registration-completed/${accountType}`);
      } else {
        setMessage(result.error || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong! Please try again.");
    }
  };
  

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      if (value && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="verify_otp_page">
      <div className="">
        <h1>Verify Your Account</h1>
        <p>
          We've sent a One-Time Password (OTP) to your email address. Please
          enter the OTP below to verify your account.
        </p>
        <div className="otp_fields">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="number"
            inputMode="numeric"
            maxLength="1"
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
            <span onClick={handleResendOTP}>Resend OTP</span>
          </p>
        </div>
        <div className="verify_actions">
          <div className="">
            <button onClick={handleGoBack} className="back">
              <img src={back} alt="" />
              <span>Go Back</span>
            </button>
            <button onClick={handleVerifyOTP} className="verify">
              <span>Verify OTP</span>
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










