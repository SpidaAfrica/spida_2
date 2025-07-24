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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, businessLicense: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading state


        if (!latitude || !longitude) {
          alert("Please enable location services.");
          return;
        }
    
        const formDataObj = new FormData();
        
        Object.keys(formData).forEach((key) => {
          formDataObj.append(key, formData[key]);
        });
    
        formDataObj.append("latitude", latitude);
        formDataObj.append("longitude", longitude);

      try {
        const response = await fetch("https://api.spida.africa/logistics/logistics_signup.php", {
            method: "POST",
            body: formDataObj,
        });
    
        // Check if the response is OK (status 200)
        if (response.ok) {
            const result = await response.json(); // Assuming API returns JSON
    
            if (result.email == formData.email) {
                alert(result.message);
                sessionStorage.setItem("logisticsEmail", formData.email);
                sessionStorage.setItem("companyName", formData.companyName);
                sessionStorage.setItem("logisticsId", formData.id);
                navigate('/verify/logistics');
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
      <form className="form logistics_form" onSubmit={handleSubmit} enctype="multipart/form-data">
        <h1>Company Information</h1>
        <div className="form_field">
          <div>
            <label htmlFor="companyName">Registered Company Name</label>
            <input
              name="companyName"
              type="text"
              placeholder="Enter Company Name"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="businessRegNumber">
              Business Registration Number
            </label>
            <input
              name="businessRegNumber"
              type="text"
              placeholder="Enter Business Registration Number"
              value={formData.businessRegNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form_field">
          <div>
            <label htmlFor="taxId">
              Tax Identification Number (TIN)
            </label>
            <input
              name="taxId"
              type="text"
              placeholder="Enter Tax Identification Number (TIN)"
              value={formData.taxId}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="logisticsServices">Nature of Logistics Services</label>
            <input
              name="logisticsServices"
              type="text"
              placeholder="Enter Area of specialization"
              value={formData.logisticsServices}
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
            <label htmlFor="fullAddress">Full Address (with landmarks)</label>
            <textarea
              name="fullAddress"
              rows="4"
              placeholder="Enter your Full Address with landmarks"
              value={formData.fullAddress}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="agreement">
          <input type="checkbox" checked={useLocation} onChange={() => setUseLocation(!useLocation)} />
          <span>
            Use My Location
          </span>
        </div>

        <div className="form_field">
          <div>
              <label>Latitude:</label>
              <input type="text" value={latitude} readOnly required />

              <label>Longitude:</label>
              <input type="text" value={longitude} readOnly required />
          </div>
        </div>

        <div className="form_field">
          <div>
            <label htmlFor="fullAddress">Delivery Radius</label>
            <input name="deliveryRadius" type="number"
              rows="4"
              placeholder="Delivery Radius (Distance/km)"
              value={formData.deliveryRadius}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form_field">
          <div className="custom_file_input">
            <input name="businessLicense" type="file" onChange={handleFileChange} />
            <div>
              <h2>
                <img src={uploadicon} alt="" />
                <span>
                {formData.businessLicense ? formData.businessLicense.name : "No file selected"}
                </span>
              </h2>
            </div>
          </div>
        </div>

        <div className="vehicle_info">
          <h1>Vehicle Information</h1>
          <div className="form_field">
            <div>
              <label htmlFor="vehicleType">Type of Vehicle</label>
              <input
                name="vehicleType"
                type="text"
                placeholder="Enter Type of Vehicle (Truck, Van, etc)"
                value={formData.vehicleType}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="vehicleRegNumber">
                Vehicle Registration Number
              </label>
              <input
                name="vehicleRegNumber"
                type="text"
                placeholder="Enter Vehicle Registration Number"
                value={formData.vehicleRegNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form_field">
            <div>
              <label htmlFor="vehicleCapacity">Capacity of Vehicle</label>
              <input
                name="vehicleCapacity"
                type="text"
                placeholder="Enter capacity in Kilograms, tonnes or bags"
                value={formData.vehicleCapacity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="vehicleMakeModel">Vehicle Make and Model</label>
              <input
                name="vehicleMakeModel"
                type="text"
                placeholder="Enter Vehicle Make and Model"
                value={formData.vehicleMakeModel}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="authorized_person">
          <h1>Authorized Signatory Details</h1>
          <div className="form_field">
            <div>
              <label htmlFor="signatoryName">Full Name</label>
              <input
                name="signatoryName"
                type="text"
                placeholder="Enter Full Name"
                value={formData.signatoryName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="authorizedSignatoryPosition">Position Held</label>
              <input
                name="positionHeld"
                type="text"
                placeholder="Enter Position Held in the Company"
                value={formData.positionHeld}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form_field">
            <div>
              <label htmlFor="authorizedSignatoryPhone">Phone Number</label>
              <input
                name="phoneNumber"
                type="text"
                placeholder="Enter Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="authorizedSignatoryId">
                Identification Card Number
              </label>
              <input
                name="idCardNumber"
                type="text"
                placeholder="Enter Identification Card Number"
                value={formData.idCardNumber}
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
            <Link to="/privacy-policy">Privacy Policy.</Link>
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

export default LogisticsForm;
