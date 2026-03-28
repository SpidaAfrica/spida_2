import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import uploadicon from "../../assets/images/product/uploadicon.png";

const BuyerIndividualForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    location: "",
    identityType: "",
    identityNumber: "",
    password: "",
    confirmPassword: "",
    address: "",
    agreement: false,
  });

  // ✅ FORMAT NIGERIAN PHONE NUMBER (+234)
  const formatNigeriaPhone = (phone) => {
    if (!phone) return "";

    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      return "+234" + cleaned.slice(1);
    }

    if (cleaned.startsWith("234")) {
      return "+" + cleaned;
    }

    if (phone.startsWith("+234")) {
      return phone;
    }

    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ AGREEMENT CHECK
    if (!formData.agreement) {
      alert("You must agree to the terms.");
      setLoading(false);
      return;
    }

    // ✅ PASSWORD MATCH
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }

    // ✅ FORMAT PHONE
    const formattedPhone = formatNigeriaPhone(formData.phoneNumber);

    // ✅ VALIDATE PHONE
    if (!formattedPhone.match(/^\+234\d{10}$/)) {
      alert("Enter a valid Nigerian phone number");
      setLoading(false);
      return;
    }

    const formDataObj = new FormData();

    const { confirmPassword, agreement, ...dataToSend } = formData;

    for (const key in dataToSend) {
      if (key === "phoneNumber") {
        formDataObj.append(key, formattedPhone); // ✅ use formatted phone
      } else {
        formDataObj.append(key, dataToSend[key]);
      }
    }

    try {
      const response = await fetch(
        "https://api.spida.africa/buyer/individual_signup.php",
        {
          method: "POST",
          body: formDataObj,
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(result.message);

        // ✅ STORE FORMATTED VALUES
        sessionStorage.setItem("individualPhone", formattedPhone);
        sessionStorage.setItem("individualEmail", formData.email);
        sessionStorage.setItem("individualName", formData.fullName);

        navigate("/verify/individual");
      } else {
        alert(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        className="form farmer_form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="form_field">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="Enter Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              name="phoneNumber"
              type="text"
              placeholder="Enter your Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form_field">
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              name="email"
              type="text"
              placeholder="Enter your Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <input
              name="location"
              type="text"
              placeholder="Enter your Location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form_field">
          <div>
            <label htmlFor="identityType">Identity Verification</label>
            <select
              name="identityType"
              value={formData.identityType}
              onChange={handleChange}
            >
              <option value="governmentId">Government Issued ID</option>
            </select>
          </div>
          <div>
            <label htmlFor="identityNumber">
              Identity Verification Number
            </label>
            <input
              name="identityNumber"
              type="text"
              placeholder="Enter your Identity Verification Number"
              value={formData.identityNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form_field">
          <div>
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Re-enter Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-enter Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form_field">
          <div>
            <label htmlFor="address">
              Full Address (with landmarks)
            </label>
            <textarea
              name="address"
              rows="4"
              placeholder="Enter your Full Address with landmarks"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="agreement">
          <input
            type="checkbox"
            name="agreement"
            checked={formData.agreement}
            onChange={handleChange}
          />
          <span>
            I have read and agree to the{" "}
            <Link to="/terms-of-service">Terms of Service</Link> and{" "}
            <Link to="/privacy-policy">Privacy Policy.</Link>
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="no_account">
        Don't have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default BuyerIndividualForm;
