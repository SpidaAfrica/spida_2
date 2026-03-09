import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import uploadicon from "../../../assets/images/product/uploadicon.png";

const AddNewFarm = () => {
  const navigate = useNavigate(); 
  const farmer_id = sessionStorage.getItem("farmerId");
  const [useLocation, setUseLocation] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [formData, setFormData] = useState({
    farmer_id: farmer_id, 
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
    farm_images: null,
    title_documents: null,
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
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSetUpFarm = async (e) => {
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
      const response = await fetch("https://api.spida.africa/farmer/farm.php", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();
      alert(result.message);
      navigate("/farmer/my-farm/farms");

      if (result.success) {
        setUseLocation(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }finally {
      setLoading(false); // Hide loading state
    }
  };


  return (
    <div className="profile_page setup_farm">
      {/* Profile Details Section */}
      <div className="profile_details">
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
              <label htmlFor="farmLandmarks">Landmarks to Farm</label>
              <input
                name="farmLandmarks"
                type="text"
                onChange={handleChange}
                value={formData.farmLandmarks}
              />
            </div>
            <div>
              <label htmlFor="farmSize">Farm Size (in acres or hectares)</label>
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
              <input
                name="titleDocuments"
                type="file"
                onChange={handleFileChange}
              />
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
          <button type="submit" target="_blank" disabled={loading} onClick={handleSetUpFarm}>
          {loading ? "Creating Your Farm..." : "Set Up Farm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewFarm;
