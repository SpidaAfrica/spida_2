import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import editicon from "../../../assets/images/icons/editprofile.png";

const LogisticsProfile = () => {
  const navigate = useNavigate();
  const logisticsId = sessionStorage.getItem("logisticsId"); // Retrieve logistics ID from session storage

  const [formData, setFormData] = useState({
    id: logisticsId, // Ensure ID is included
    companyName: "",
    regNumber: "",
    taxNo: "",
    serviceNature: "",
    email: "",
    location: "lagos",
    businessAddress: "",
    landmarks: "",
    operationalAreas: "",
    workingHours: "",
    dispatchSpeed: "",
    onTimeDelivery: "",
    profileImage: null, // Set to null initially for file upload
  });

  // Fetch existing user profile
  useEffect(() => {
    if (logisticsId) {
      fetch(`https://api.spida.africa/logistics/logistics_profile.php?id=${logisticsId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setFormData((prev) => ({ ...prev, ...data }));
          }
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [logisticsId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value, // Store actual file, not object URL
    }));
  };

  // Handle profile image selection
  const handleEditProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profileImage: file,
      }));
    }
  };

  // Handle profile setup
  const handleSetupProfile = () => {
    const formDataToSend = new FormData(); // Use FormData for file upload
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    fetch("https://api.spida.africa/logistics/logistics_profile.php", {
      method: "POST",
      body: formDataToSend,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.success || data.error);
        if (data.success) navigate("/profile/setup-completed/logistics");
      })
      .catch((err) => console.error("Error updating profile:", err));
  };
  return (
    <div className="farmer_profile_page">
      <div className="">
        <h5>Edit Profile</h5>

        {/* Profile Image Section */}
        <div className="profile_img">
          <div className="">
            <img className="_img" src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : ""} alt="Profile" />
            <label htmlFor="profileImageUpload">
              <img src={editicon} alt="Edit Profile" className="edit_icon" />
            </label>
            <input
              id="profileImageUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleEditProfileImage}
            />
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="profile_details">
          <div className="">
            <h1>Company Information</h1>
            <div className="form_field">
              <div>
                <label htmlFor="companyName">Registered Company Name</label>
                <input
                  name="companyName"
                  type="text"
                  onChange={handleChange}
                  value={formData.companyName}
                />
              </div>
              <div>
                <label htmlFor="regNumber">Business Registration Number</label>
                <input
                  name="regNumber"
                  type="text"
                  onChange={handleChange}
                  value={formData.regNumber}
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="taxNo">Tax Identification Number</label>
                <input
                  name="taxNo"
                  type="text"
                  onChange={handleChange}
                  value={formData.taxNo}
                />
              </div>
              <div>
                <label htmlFor="serviceNature">
                  Nature of Logistics Services
                </label>
                <input
                  name="serviceNature"
                  type="text"
                  onChange={handleChange}
                  value={formData.serviceNature}
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div>
                <label htmlFor="location">Location</label>
                <select
                  name="location"
                  onChange={handleChange}
                  value={formData.location}
                >
                  <option value="lagos">Lagos</option>
                </select>
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="businessAddress">Business Address</label>
                <input
                  name="businessAddress"
                  type="text"
                  onChange={handleChange}
                  value={formData.businessAddress}
                />
              </div>
              <div>
                <label htmlFor="landmarks">Landmarks</label>
                <input
                  name="landmarks"
                  type="text"
                  onChange={handleChange}
                  value={formData.landmarks}
                />
              </div>
            </div>
          </div>
          {/* Farm Details Section */}
          <div className="">
            <h1>Operational Details</h1>
            <div className="form_field">
              <div>
                <label htmlFor="operationalAreas">Operational Areas</label>
                <input
                  name="operationalAreas"
                  type="text"
                  onChange={handleChange}
                  value={formData.operationalAreas}
                />
              </div>
              <div>
                <label htmlFor="workingHours">Preferred Working Hours</label>
                <input
                  name="workingHours"
                  type="text"
                  onChange={handleChange}
                  value={formData.workingHours}
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="dispatchSpeed">
                  Average Dispatch Speed upon Pickup
                </label>
                <input
                  name="dispatchSpeed"
                  type="text"
                  onChange={handleChange}
                  value={formData.dispatchSpeed}
                />
              </div>
              <div>
                <label htmlFor="onTimeDelivery">
                  On-time Delivery rate (in percentage)
                </label>
                <input
                  name="onTimeDelivery"
                  type="text"
                  onChange={handleChange}
                  value={formData.onTimeDelivery}
                />
              </div>
            </div>
          </div>

          <div className="">
            <button onClick={handleSetupProfile}>Set up profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsProfile;


