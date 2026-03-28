import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import uploadicon from "../../assets/images/product/uploadicon.png";

const BuyerBusinessForm = () => {
  const [formData, setFormData] = useState({
    business_name: "",
    business_phone: "",
    business_email: "",
    business_location: "",
    business_registration_number: "",
    identity_verification_number: "",
    password: "",
    confirm_password: "",
    business_address: "",
    contact_person_name: "",
    contact_person_title: "",
    corporate_email: "",
    official_phone: "",
    agreement: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ FORMAT NIGERIAN PHONE
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

    if (loading) return;
    setLoading(true);

    // ✅ AGREEMENT CHECK
    if (!formData.agreement) {
      alert("You must agree to the terms.");
      setLoading(false);
      return;
    }

    // ✅ PASSWORD CHECK
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }

    // ✅ FORMAT PHONES
    const formattedBusinessPhone = formatNigeriaPhone(formData.business_phone);
    const formattedOfficialPhone = formatNigeriaPhone(formData.official_phone);

    // ✅ VALIDATE PHONES
    const phoneRegex = /^\+234\d{10}$/;

    if (!phoneRegex.test(formattedBusinessPhone)) {
      alert("Enter a valid Business Phone Number");
      setLoading(false);
      return;
    }

    if (!phoneRegex.test(formattedOfficialPhone)) {
      alert("Enter a valid Official Phone Number");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "business_phone") {
        formDataToSend.append(key, formattedBusinessPhone);
      } else if (key === "official_phone") {
        formDataToSend.append(key, formattedOfficialPhone);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(
        "https://api.spida.africa/buyer/business_signup.php",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await response.json();
      console.log("API result:", result);

      if (response.ok && result.success) {
        alert(result.message || "Signup successful!");

        // ✅ STORE FORMATTED VALUES
        sessionStorage.setItem(
          "businessPhone",
          formattedBusinessPhone
        );
        sessionStorage.setItem(
          "officialPhone",
          formattedOfficialPhone
        );
        sessionStorage.setItem(
          "businessEmail",
          result.email || formData.business_email
        );
        sessionStorage.setItem("businessId", result.id || "");
        sessionStorage.setItem(
          "businessName",
          result.business_name || formData.business_name
        );

        navigate("/verify/business");
      } else {
        alert(
          result.error ||
            result.message ||
            "Signup failed. Please review your inputs and try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="form farmer_form" onSubmit={handleSubmit} enctype="multipart/form-data">
        <h1>Business Information</h1>

        <div className="form_field">
          <div>
            <label htmlFor="businessName">Business Name</label>
            <input
              name="business_name"
              type="text"
              placeholder="Enter Business Name"
              onChange={handleChange}
              value={formData.business_name}
            />
          </div>
          <div>
            <label htmlFor="businessPhone">Business Phone Number</label>
            <input
              name="business_phone"
              type="text"
              placeholder="Enter your Business Phone Number"
              onChange={handleChange}
              value={formData.business_phone}
            />
          </div>
        </div>

        <div className="form_field">
          <div>
            <label htmlFor="businessEmail">Business Email Address</label>
            <input
              name="business_email"
              type="email"
              placeholder="Enter your Business Email Address"
              onChange={handleChange}
              value={formData.business_email}
            />
          </div>
          <div>
            <label htmlFor="businessLocation">Business Location</label>
            <select
              name="business_location"
              onChange={handleChange}
              value={formData.business_location}
            >
              <option value="">Select Your Location (City)</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Port Harcourt">Port Harcourt</option>
            </select>
          </div>
        </div>

        <div className="form_field">
          <div>
            <label htmlFor="businessRegNumber">
              Business Registration Number
            </label>
            <input
              name="business_registration_number"
              type="text"
              placeholder="Enter your Business Registration Number"
              onChange={handleChange}
              value={formData.business_registration_number}
            />
          </div>
          <div>
            <label htmlFor="idNumber">Identity Verification Number</label>
            <input
              name="identity_verification_number"
              type="text"
              placeholder="Enter your Identity Verification Number"
              onChange={handleChange}
              value={formData.identity_verification_number}
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
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Re-enter Password</label>
            <input
              name="confirm_password"
              type="password"
              placeholder="Re-enter Password"
              onChange={handleChange}
              value={formData.confirm_password}
            />
          </div>
        </div>

        <div className="form_field">
          <div>
            <label htmlFor="fullAddress">Full Address (with landmarks)</label>
            <textarea
              name="business_address"
              rows="4"
              placeholder="Enter your Full Address with landmarks"
              onChange={handleChange}
              value={formData.business_address}
            />
          </div>
        </div>

        <div className="authorized_person">
          <h1>Contact Person Information</h1>
          <div className="form_field">
            <div>
              <label htmlFor="contactName">Full Name</label>
              <input
                name="contact_person_name"
                type="text"
                placeholder="Enter Full Name"
                onChange={handleChange}
                value={formData.contact_person_name}
              />
            </div>
            <div>
              <label htmlFor="contactTitle">Title</label>
              <input
                name="contact_person_title"
                type="text"
                placeholder="Enter Title"
                onChange={handleChange}
                value={formData.contact_person_title}
              />
            </div>
          </div>
          <div className="form_field">
            <div>
              <label htmlFor="contactEmail">Corporate Email Address</label>
              <input
                name="corporate_email"
                type="email"
                placeholder="Enter your Corporate Email Address"
                onChange={handleChange}
                value={formData.corporate_email}
              />
            </div>
            <div>
              <label htmlFor="contactPhone">Official Phone Number</label>
              <input
                name="official_phone"
                type="text"
                placeholder="Enter your Official Phone Number"
                onChange={handleChange}
                value={formData.official_phone}
              />
            </div>
          </div>
        </div>

        <div className="agreement">
          <input
            type="checkbox"
            name="agreement"
            onChange={handleChange}
            checked={formData.agreement}
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
        Dont have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default BuyerBusinessForm;
