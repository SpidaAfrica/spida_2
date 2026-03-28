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

  /* ------------------ GEOLOCATION ------------------ */
  useEffect(() => {
    if (useLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        (err) => alert("Location error: " + err.message)
      );
    } else {
      setLatitude("");
      setLongitude("");
    }
  }, [useLocation]);

  /* ------------------ INPUT HANDLERS ------------------ */
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

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // ✅ Validations
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!formData.termsAgreed) {
      alert("You must agree to the terms");
      return;
    }

    if (!latitude || !longitude) {
      alert("Please enable location");
      return;
    }

    if (!formData.businessLicense) {
      alert("Please upload business license");
      return;
    }

    setLoading(true);

    try {
      const formDataObj = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          key !== "confirmPassword" &&
          key !== "termsAgreed"
        ) {
          formDataObj.append(key, value);
        }
      });

      // Append location
      formDataObj.append("latitude", latitude);
      formDataObj.append("longitude", longitude);

      // Format phone (+234)
      let phone = formData.phoneNumber;
      if (phone.startsWith("0")) {
        phone = "+234" + phone.slice(1);
      }
      formDataObj.set("phoneNumber", phone);

      const res = await fetch(
        "https://api.spida.africa/logistics/logistics_signup.php",
        {
          method: "POST",
          body: formDataObj,
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Signup failed");
      }

      alert(result.message);

      // Save for OTP verification
      sessionStorage.setItem("logisticsPhone", formData.phoneNumber);
      sessionStorage.setItem("companyName", formData.companyName);

      navigate("/verify/logistics");
    } catch (err) {
      console.error(err);
      alert(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <form className="form logistics_form" onSubmit={handleSubmit} encType="multipart/form-data">
      <h1>Company Information</h1>

      <input name="companyName" placeholder="Company Name" onChange={handleChange} />
      <input name="businessRegNumber" placeholder="Registration Number" onChange={handleChange} />
      <input name="taxId" placeholder="TIN" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />

      <textarea name="fullAddress" placeholder="Full Address" onChange={handleChange} />

      <div>
        <input type="checkbox" checked={useLocation} onChange={() => setUseLocation(!useLocation)} />
        Use My Location
      </div>

      <input value={latitude} readOnly />
      <input value={longitude} readOnly />

      <input type="file" onChange={handleFileChange} />

      <h2>Vehicle Info</h2>
      <input name="vehicleType" placeholder="Vehicle Type" onChange={handleChange} />
      <input name="vehicleRegNumber" placeholder="Vehicle Reg" onChange={handleChange} />
      <input name="vehicleCapacity" placeholder="Capacity" onChange={handleChange} />
      <input name="vehicleMakeModel" placeholder="Make & Model" onChange={handleChange} />

      <h2>Authorized Person</h2>
      <input name="signatoryName" placeholder="Full Name" onChange={handleChange} />
      <input name="positionHeld" placeholder="Position" onChange={handleChange} />
      <input name="idCardNumber" placeholder="ID Number" onChange={handleChange} />

      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} />

      <div>
        <input type="checkbox" name="termsAgreed" onChange={handleChange} />
        I agree to Terms
      </div>

      <button disabled={loading}>
        {loading ? "Creating..." : "Create Account"}
      </button>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default LogisticsForm;
