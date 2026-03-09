import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import editicon from "../../../assets/images/icons/editprofile.png";
import uploadicon from "../../../assets/images/product/uploadicon.png";
import profileImg from "../../../assets/images/userimg2.png";



const FarmerProfile = () => {
  const navigate = useNavigate();
  const farmer_id = localStorage.getItem('userId');
  const farmer_type = localStorage.getItem('userType');
  console.log(farmer_id);
  const [formData, setFormData] = useState({
    farmer_id: farmer_id,  // Store dynamically
    full_name: "",
    date_of_birth: "",
    email: "",
    phone_number: "",
    id_type: "",
    id_number: "",
    location: "",
    address: "",
    account_name: "",
    bank: "",
    account_number: "",
    bvn: "",
    farm_name: "",
    farm_location: "",
    farm_lga: "",
    farm_address: "",
    farm_landmarks: "",
    farm_size: "",
    production_scale: "",
    staff_size: "",
    type_of_farming: "",
    crop_type: "",
    profileImage: profileImg,
    farm_images: null,
    title_documents: null,
  });
  
  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const response = await fetch(`https://api.spida.africa/farmer/farmer.php?farmer_id=${farmer_id}`); // Replace 1 dynamically
        const data = await response.json();
  
        if (data.status === "success") {
          setFormData({
            farmer_id: data.farmer.id,
            full_name: data.farmer.full_name,
            date_of_birth: data.farmer.dob,
            email: data.farmer.email,
            phone_number: data.farmer.phone,
            id_type: data.farmer.identity_type,
            id_number: data.farmer.identity_number,
            location: data.farmer.location,
            address: data.farmer.home_address,
            account_name: data.farmer.account_name,
            bank: data.farmer.bank,
            account_number: data.farmer.account_number,
            bvn: data.farmer.bvn,
            profile_image: data.farmer.profile_image,
            farm_name: data.farm.farm_name,
            farm_location: data.farm.farm_location,
            farm_lga: data.farm.farm_lga,
            farm_address: data.farm.farm_address,
            farm_landmarks: data.farm.farm_landmarks,
            farm_size: data.farm.farm_size,
            production_scale: data.farm.production_scale,
            staff_size: data.farm.staff_size,
            type_of_farming: data.farm.type_of_farming,
            crop_type: data.farm.crop_type,
            farm_images: data.farm.farm_images,
            title_documents: data.farm.title_documents,
          });
        }
      } catch (error) {
        console.error("Error fetching farmer details:", error);
      }
    };
  
    fetchFarmerDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};



  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };


  /*const handleSetUpFarm = () => {
    alert("Setting Up farm");
    navigate("/profile/setup-completed");
  };*/

  const handleSetUpFarm = async () => {
    const updatedFormData = new FormData();
    
    Object.keys(formData).forEach((key) => {
      updatedFormData.append(key, formData[key]);
    });
  
    try {
      const response = await fetch("https://api.spida.africa/farmer/update_farmer_profile.php", {
        method: "POST",
        body: updatedFormData,
      });
  
      const data = await response.json();
      console.log(data)
      alert(data.message);
  
      if (data.status === "success") {
        navigate(`/profile/setup-completed/${farmer_type}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="farmer_profile_page">
      <div className="">
        <h5>Edit Profile</h5>

        {/* Profile Image Section */}
        {/*
        <div className="profile_img">
          <div className="">
          {formData.profileImagePreview && (
              <img className='_img' src={formData.profileImagePreview} alt="Profile Preview" width="100" />
            )}
            <label htmlFor="profileImageUpload">
              <img src={editicon} alt="Edit Profile" className="edit_icon" />
            </label>
            <input
              name="profileImages" type="file" onChange={handleFileChange} 
            />
          </div>
        </div>
        */}
        {/* Profile Details Section */}
        <div className="profile_details">
          <div className="">
            <h1>Profile Info</h1>
            <div className="form_field">
              <div>
                <label htmlFor="fullName">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  onChange={handleChange}
                  value={formData.fullName}
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  onChange={handleChange}
                  value={formData.dateOfBirth}
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  name="phoneNumber"
                  type="text"
                  onChange={handleChange}
                  value={formData.phoneNumber}
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="idType">Identity Verification</label>
                <select
                  name="idType"
                  onChange={handleChange}
                  value={formData.idType}
                >
                  <option value="Drivers Licence">Drivers Licence</option>
                  <option value="National ID">National ID</option>
                </select>
              </div>
              <div>
                <label htmlFor="idNumber">Identity Verification Number</label>
                <input
                  name="idNumber"
                  type="text"
                  onChange={handleChange}
                  value={formData.idNumber}
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="location">Location</label>
                <select
                  name="location"
                  onChange={handleChange}
                  value={formData.location}
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Ogun">Ogun</option>
                </select>
              </div>
              <div>
                <label htmlFor="address">Home Address</label>
                <input
                  name="address"
                  type="text"
                  onChange={handleChange}
                  value={formData.address}
                />
              </div>
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="">
            <h1>Bank Details</h1>
            <div className="form_field">
              <div>
                <label htmlFor="accountName">Account Name</label>
                <input
                  name="accountName"
                  type="text"
                  onChange={handleChange}
                  value={formData.accountName}
                />
              </div>
              <div>
                <label htmlFor="bank">Bank</label>
                <input
                  name="bank"
                  type="text"
                  onChange={handleChange}
                  value={formData.bank}
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="accountNumber">Account Number</label>
                <input
                  name="accountNumber"
                  type="text"
                  onChange={handleChange}
                  value={formData.accountNumber}
                />
              </div>
              <div>
                <label htmlFor="bvn">BVN</label>
                <input
                  name="bvn"
                  type="text"
                  onChange={handleChange}
                  value={formData.bvn}
                />
              </div>
            </div>
          </div>

          {/* Farm Details Section */}
          <div className="">
            <h1>Setup Farm</h1>
            <div className="form_field">
              <div>
                <label htmlFor="farmName">Farm Name</label>
                <input
                  name="farmName"
                  type="text"
                  onChange={handleChange}
                  value={formData.farmName}
                />
              </div>
              <div>
                <label htmlFor="farmLocation">Farm Location</label>
                <select
                  name="farmLocation"
                  onChange={handleChange}
                  value={formData.farmLocation}
                >
                  <option value="Ogun State">Ogun State</option>
                  <option value="Lagos State">Lagos State</option>
                </select>
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="farmLGA">Farm Local Government Area</label>
                <select
                  name="farmLGA"
                  onChange={handleChange}
                  value={formData.farmLGA}
                >
                  <option value="Ogun Central">Ogun Central</option>
                  <option value="Ogun East">Ogun East</option>
                </select>
              </div>
              <div>
                <label htmlFor="farmAddress">Farm Address</label>
                <input
                  name="farmAddress"
                  type="text"
                  onChange={handleChange}
                  value={formData.farmAddress}
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="farmLandmarks">Landmarks to Farm</label>
                <input
                  name="farmLandmarks"
                  type="text"
                  onChange={handleChange}
                  value={formData.farmLandmarks}
                />
              </div>
              <div>
                <label htmlFor="farmSize">
                  Farm Size (in acres or hectares)
                </label>
                <input
                  name="farmSize"
                  type="text"
                  onChange={handleChange}
                  value={formData.farmSize}
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="productionScale">Scale of Production</label>
                <select
                  name="productionScale"
                  onChange={handleChange}
                  value={formData.productionScale}
                >
                  <option value="Large Scale">Large Scale</option>
                  <option value="Small Scale">Small Scale</option>
                </select>
              </div>
              <div>
                <label htmlFor="staffSize">Number of Staff</label>
                <input
                  name="staffSize"
                  type="text"
                  onChange={handleChange}
                  value={formData.staffSize}
                />
              </div>
            </div>
            <div className="form_field">
              <div>
                <label htmlFor="typeOfFarming">Type of Farming</label>
                <input
                  name="typeOfFarming"
                  type="text"
                  onChange={handleChange}
                  value={formData.typeOfFarming}
                />
              </div>
              <div>
                <label htmlFor="cropType">Crops Grown</label>
                <input
                  name="cropType"
                  type="text"
                  onChange={handleChange}
                  value={formData.cropType}
                />
              </div>
            </div>
            <div className="form_field">
              <div className="custom_file_input">
                <input name="farmImages" type="file" onChange={handleFileChange} />
                <div>
                  <h2>
                    <img src={uploadicon} alt="" />
                    <span>
                      {formData.farmImages ? formData.farmImages.name : "Upload images of your farm"}
                    </span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="form_field">
              <div className="custom_file_input">
                <input name="titleDocuments" type="file" onChange={handleFileChange} />
                <div>
                  <h2>
                    <img src={uploadicon} alt="" />
                    <span>
                    {formData.titleDocuments ? formData.titleDocuments.name :"Upload Title Documents"}
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <button onClick={handleSetUpFarm}>Set up farm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
