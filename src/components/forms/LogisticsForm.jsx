import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import uploadicon from "../../assets/images/product/uploadicon.png";

const LogisticsForm = () => {
  const navigate = useNavigate();

  const [useLocation, setUseLocation] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    businessRegNumber: "",
    taxId: "",
    logisticsServices: "",
    email: "",
    location: "",
    fullAddress: "",
    deliveryRadius: "",
    vehicleType: "",
    vehicleRegNumber: "",
    vehicleCapacity: "",
    vehicleMakeModel: "",
    signatoryName: "",
    positionHeld: "",
    phoneNumber: "",
    idCardNumber: "",
    password: "",
    confirmPassword: "",
    termsAgreed: false,
    businessLicense: null,
  });

  useEffect(() => {
    if (useLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            alert("Failed to get location: " + error.message);
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    } else {
      setLatitude("");
      setLongitude("");
    }
  }, [useLocation]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      businessLicense: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!latitude || !longitude) {
      alert("Please enable location services.");
      return;
    }

    if (!formData.termsAgreed) {
      alert("You must agree to the terms and privacy policy.");
      return;
    }

    setLoading(true);

    const formDataObj = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataObj.append(key, formData[key]);
      }
    });

    formDataObj.append("latitude", latitude);
    formDataObj.append("longitude", longitude);

    try {
      const response = await fetch(
        "https://api.spida.africa/logistics/logistics_signup.php",
        {
          method: "POST",
          body: formDataObj,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Server error");
      }

      if (result.email === formData.email) {
        alert(result.message);

        sessionStorage.setItem("logisticsEmail", formData.email);
        sessionStorage.setItem("companyName", formData.companyName);

        navigate("/verify/logistics");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        className="form logistics_form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h1>Company Information</h1>

        <div className="form_field">
          <input
            name="companyName"
            type="text"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <input
            name="businessRegNumber"
            type="text"
            placeholder="Registration Number"
            value={formData.businessRegNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form_field">
          <input
            name="taxId"
            type="text"
            placeholder="Tax ID"
            value={formData.taxId}
            onChange={handleChange}
          />

          <input
            name="logisticsServices"
            type="text"
            placeholder="Logistics Services"
            value={formData.logisticsServices}
            onChange={handleChange}
          />
        </div>

        <div className="form_field">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="fullAddress"
          placeholder="Full Address"
          value={formData.fullAddress}
          onChange={handleChange}
        />

        <div>
          <input
            type="checkbox"
            checked={useLocation}
            onChange={() => setUseLocation(!useLocation)}
          />
          <span>Use My Location</span>
        </div>

        <input type="text" value={latitude} readOnly placeholder="Latitude" />
        <input type="text" value={longitude} readOnly placeholder="Longitude" />

        <input
          name="deliveryRadius"
          type="number"
          placeholder="Delivery Radius"
          value={formData.deliveryRadius}
          onChange={handleChange}
        />

        <div className="custom_file_input">
          <input type="file" onChange={handleFileChange} />

          <span>
            {formData.businessLicense
              ? formData.businessLicense.name
              : "Upload Business License"}
          </span>
        </div>

        <h2>Vehicle Information</h2>

        <input
          name="vehicleType"
          placeholder="Vehicle Type"
          value={formData.vehicleType}
          onChange={handleChange}
        />

        <input
          name="vehicleRegNumber"
          placeholder="Vehicle Reg Number"
          value={formData.vehicleRegNumber}
          onChange={handleChange}
        />

        <input
          name="vehicleCapacity"
          placeholder="Capacity"
          value={formData.vehicleCapacity}
          onChange={handleChange}
        />

        <input
          name="vehicleMakeModel"
          placeholder="Make & Model"
          value={formData.vehicleMakeModel}
          onChange={handleChange}
        />

        <h2>Signatory</h2>

        <input
          name="signatoryName"
          placeholder="Full Name"
          value={formData.signatoryName}
          onChange={handleChange}
        />

        <input
          name="positionHeld"
          placeholder="Position"
          value={formData.positionHeld}
          onChange={handleChange}
        />

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <input
          name="idCardNumber"
          placeholder="ID Number"
          value={formData.idCardNumber}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <div>
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleChange}
          />
          <span>
            I agree to the{" "}
            <Link to="/terms-of-service">Terms</Link> and{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default LogisticsForm;
