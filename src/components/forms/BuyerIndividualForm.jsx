import React, { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
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
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };




    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true); // Show loading state


    const formDataObj = new FormData();

      for (const key in formData) {
          formDataObj.append(key, formData[key]);
      }
      try {
        const response = await fetch("https://api.spida.africa/buyer/individual_signup.php", {
            method: "POST",
            body: formDataObj,
        });
    
        // Check if the response is OK (status 200)
        if (response.ok) {
            const result = await response.json(); // Assuming API returns JSON
    
            if (result.email == formData.email) {
                alert(result.message);
                sessionStorage.setItem("individualEmail", formData.email);
                sessionStorage.setItem("individualId", formData.id);
                sessionStorage.setItem("individualName", formData.fullName);
                navigate('/verify/individual');
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
            <label htmlFor="idNumber">Identity Verification Number</label>
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
            <label htmlFor="address">Full Address (with landmarks)</label>
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

export default BuyerIndividualForm;
