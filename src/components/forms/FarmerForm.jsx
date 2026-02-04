/*import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import uploadicon from "../../assets/images/product/uploadicon.png";
import { openDB } from "idb";

const DB_NAME = "FarmerFormDB";
const STORE_NAME = "signupForms";

const initDB = async () => {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

const FarmerSignupForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    addressVerification: "",
    verificationNumber: "",
    location: "",
    homeAddress: "",
    farmName: "",
    farmLocation: "",
    farmLGA: "",
    farmAddress: "",
    password: "",
    utilityBill: null,
    farmOwnershipProof: null,
    confirmPassword: "",
    termsAgreed: false
  });

  const locations = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Enugu"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const sendToServer = async (data) => {
    const formDataObj = new FormData();
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
        formDataObj.append(key, data[key]);
      }
    }

    const response = await fetch("https://api.spida.africa/farmer/farmer_signup.php", {
      method: "POST",
      body: formDataObj,
    });

    if (response.ok) {
      const result = await response.json();
      if (result && result.email === data.email) {
        alert(result.message);
        sessionStorage.setItem("farmerEmail", data.email);
        sessionStorage.setItem("farmerName", data.fullName);
        sessionStorage.setItem("farmerId", data.id);
        navigate("/verify/farmer");
      } else {
        alert("There is an issue, please try signing up again.");
      }
    } else {
      throw new Error("Server error");
    }
  };

  const syncData = async () => {
    const db = await initDB();
    const allData = await db.getAll(STORE_NAME);
    for (const item of allData) {
      try {
        await sendToServer(item);
        await db.delete(STORE_NAME, item.id);
      } catch (err) {
        console.error("Failed to sync:", err);
        return;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const db = await initDB();

    const entry = { ...formData, createdAt: new Date().toISOString() };

    if (navigator.onLine) {
      try {
        await sendToServer(entry);
      } catch (error) {
        await db.add(STORE_NAME, entry);
        alert("Network error. Form saved locally.");
      }
    } else {
      await db.add(STORE_NAME, entry);
      alert("You are offline. Form saved locally and will sync automatically.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const syncWhenOnline = async () => {
      if (navigator.onLine) {
        await syncData();
      }
    };
    window.addEventListener("online", syncWhenOnline);
    syncWhenOnline();
    return () => window.removeEventListener("online", syncWhenOnline);
  }, []);

  return (
    <div>
      <form className="form farmer_form" onSubmit={handleSubmit} enctype="multipart/form-data">
        <h1>Personal Information</h1>
        <div className="form_field">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="Enter your Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="dob">Date of Birth</label>
            <input
              name="dob"
              type="date"
              placeholder="Enter your Date of Birth"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form_field">
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phone">Phone Number</label>
            <input
              name="phone"
              type="text"
              placeholder="Enter your Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form_field">
          <div>
            <label htmlFor="addressVerification">Address Verification</label>
            <select
              name="addressVerification"
              value={formData.addressVerification}
              onChange={handleChange}
            >
              <option value="govermentIssued">Government Issued ID</option>
            </select>
          </div>
          <div>
            <label htmlFor="verificationNumber">
              Identity Verification Number
            </label>
            <input
              name="verificationNumber"
              type="text"
              placeholder="Enter your Identity Verification Number"
              value={formData.verificationNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form_field">
          <div>
            <label htmlFor="location">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Select your Location</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="homeAddress">Home Address</label>
            <input
              name="homeAddress"
              type="text"
              placeholder="Enter your Home Address"
              value={formData.homeAddress}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form_field">
          <div className="custom_file_input">
            <input name="utilityBill" type="file" onChange={handleFileChange} />
            <div>
              <h2>
                <img src={uploadicon} alt="" />
                <span>
                {formData.utilityBill ? formData.utilityBill.name : "Upload Passport Photograph"}
                </span>
              </h2>
            </div>
          </div>
        </div>
        <div className="farm_info">
          <h1>Farm Information</h1>
          <div className="form_field">
            <div>
              <label htmlFor="farmName">Farm Name</label>
              <input
                name="farmName"
                type="text"
                placeholder="Enter Farm Name"
                value={formData.farmName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="farmLocation">Farm Location</label>
              <input
                name="farmLocation"
                type="text"
                placeholder="Enter Farm Location"
                value={formData.farmLocation}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form_field">
            <div>
              <label htmlFor="farmLGA">
                Farm Local Government Area
              </label>
              <input
                name="farmLGA"
                type="text"
                placeholder="Enter Farm Local Government Area"
                value={formData.farmLGA}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="farmAddress">Farm Address</label>
              <input
                name="farmAddress"
                type="text"
                placeholder="Enter Farm Address"
                value={formData.farmAddress}
                onChange={handleChange}
              />
            </div>
          </div>
          /*
          <div className="form_field">
            <div className="custom_file_input">
              <input
                name="farmOwnershipProof"
                type="file"
                onChange={handleFileChange}
              />
              <div>
                <h2>
                  <img src={uploadicon} alt="" />
                  <span>
                  {formData.farmOwnershipProof ? formData.farmOwnershipProof.name : "No file selected"}
                  </span>
                </h2>
              </div>
            
            </div>
          </div>
          *
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
        <div className="agreement">
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleChange}
          />
          <span>
            I have read and agree to the{" "}
            <Link to="/terms-of-service">Terms of Service</Link> and{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </span>
        </div>
        <button type="submit" target="_blank" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p className="no_account">
        Don't have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default FarmerSignupForm;
*/

import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import uploadicon from "../../assets/images/product/uploadicon.png";

const FarmerSignupForm = () => {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false); 
  const [formData, setFormData] = useState({
      fullName: "",
      dob: "",
      email: "",
      phone: "",
      addressVerification: "",
      verificationNumber: "",
      location: "",
      homeAddress: "",
      farmName: "",
      farmLocation: "",
      farmLGA: "",
      farmAddress: "",
      password: "",
      utilityBill: null,
      farmProof: null
  });
  const locations = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Enugu"];
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true); // Show loading state

      const formDataObj = new FormData();

      for (const key in formData) {
          formDataObj.append(key, formData[key]);
      }

      try {
        const response = await fetch("https://api.spida.africa/farmer/farmer_signup.php", {
            method: "POST",
            body: formDataObj,
        });
    
        // Check if the response is OK (status 200)
        if (response.ok) {
            const result = await response.json(); // Assuming API returns JSON
    
            if (result.email == formData.email) {
                alert(result.message);
                sessionStorage.setItem("farmerEmail", formData.email);
                sessionStorage.setItem("farmerName", formData.fullName);
                sessionStorage.setItem("farmerId", formData.id);
                navigate('/verify/farmer');
            } else {
                alert("There is an issue, please try signing up again. Ensure you fill all form input");
            }
        } else {
            alert("Server error! Please try again later.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Network error! Please check your internet connection and try again. Also Ensure you fill all form input");
    } finally {
      setLoading(false); // Hide loading state
    }
    
  };
  return (
    <div>
      <form className="form farmer_form" onSubmit={handleSubmit} enctype="multipart/form-data">
        <h1>Personal Information</h1>
        <div className="form_field">
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="Enter your Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="dob">Date of Birth</label>
            <input
              name="dob"
              type="date"
              placeholder="Enter your Date of Birth"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form_field">
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phone">Phone Number</label>
            <input
              name="phone"
              type="text"
              placeholder="Enter your Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form_field">
          <div>
            <label htmlFor="addressVerification">Address Verification</label>
            <select
              name="addressVerification"
              value={formData.addressVerification}
              onChange={handleChange}
            >
              <option value="govermentIssued">Government Issued ID</option>
            </select>
          </div>
          <div>
            <label htmlFor="verificationNumber">
              Identity Verification Number
            </label>
            <input
              name="verificationNumber"
              type="text"
              placeholder="Enter your Identity Verification Number"
              value={formData.verificationNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form_field">
          <div>
            <label htmlFor="location">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Select your Location</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="homeAddress">Home Address</label>
            <input
              name="homeAddress"
              type="text"
              placeholder="Enter your Home Address"
              value={formData.homeAddress}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form_field">
          <div className="custom_file_input">
            <input name="utilityBill" type="file" onChange={handleFileChange} />
            <div>
              <h2>
                <img src={uploadicon} alt="" />
                <span>
                {formData.utilityBill ? formData.utilityBill.name : "No file selected"}
                </span>
              </h2>
            </div>
          </div>
        </div>
        <div className="farm_info">
          <h1>Farm Information</h1>
          <div className="form_field">
            <div>
              <label htmlFor="farmName">Farm Name</label>
              <input
                name="farmName"
                type="text"
                placeholder="Enter Farm Name"
                value={formData.farmName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="farmLocation">Farm Location</label>
              <input
                name="farmLocation"
                type="text"
                placeholder="Enter Farm Location"
                value={formData.farmLocation}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form_field">
            <div>
              <label htmlFor="farmLGA">
                Farm Local Government Area
              </label>
              <input
                name="farmLGA"
                type="text"
                placeholder="Enter Farm Local Government Area"
                value={formData.farmLGA}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="farmAddress">Farm Address</label>
              <input
                name="farmAddress"
                type="text"
                placeholder="Enter Farm Address"
                value={formData.farmAddress}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form_field">
            <div className="custom_file_input">
              <input
                name="farmOwnershipProof"
                type="file"
                onChange={handleFileChange}
              />
              <div>
                <h2>
                  <img src={uploadicon} alt="" />
                  <span>
                  {formData.farmOwnershipProof ? formData.farmOwnershipProof.name : "No file selected"}
                  </span>
                </h2>
              </div>
            </div>
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
        <div className="agreement">
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleChange}
          />
          <span>
            I have read and agree to the{" "}
            <Link to="/terms-of-service">Terms of Service</Link> and{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </span>
        </div>
        <button type="submit" target="_blank" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p className="no_account">
        Don't have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default FarmerSignupForm;

/*
const initialFormState = {
  fullName: "",
  dateOfBirth: "",
  email: "",
  phoneNumber: "",
  addressVerification: "govermentIssued",
  verificationNumber: "",
  location: "",
  homeAddress: "",
  utilityBill: "",
  farmName: "",
  farmLocation: "",
  farmLocalGovernment: "",
  farmAddress: "",
  farmOwnershipProof: "",
  password: "",
  confirmPassword: "",
  termsAgreed: false,
};

const FarmerForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]?.name || ""
          : value,
    }));
  };

  const locations = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Enugu"];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    navigate("/verify/farmer"); 
    // Add form submission logic here
  };
*/
