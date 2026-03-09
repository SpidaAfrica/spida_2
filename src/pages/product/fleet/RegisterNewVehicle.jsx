
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import uploadicon from "../../../assets/images/product/uploadicon.png";


const logisticsId = sessionStorage.getItem("logisticsId");
const initialFormState = {
  logisticsId: logisticsId, // Assume a logged-in logistics company
  vehicleType: "",
  vehicleNumber: "",
  vehicleCapacity: "",
  vehicleModel: "",
  vehicleFeatures: "",
  vehicleImg: null,
  ownerShipDocuments: null,
  roadWorthinessDocuments: null,
};

const RegisterNewVehicle = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleRegisterVehicle = async () => {
    setLoading(true);
    const formDataObj = new FormData();
    formDataObj.append("logistics_id", logisticsId);
    formDataObj.append("vehicleType", formData.vehicleType);
    formDataObj.append("vehicleNumber", formData.vehicleNumber);
    formDataObj.append("vehicleCapacity", formData.vehicleCapacity);
    formDataObj.append("vehicleModel", formData.vehicleModel);
    formDataObj.append("vehicleFeatures", formData.vehicleFeatures);
    formDataObj.append("vehicleImg", formData.vehicleImg);
    formDataObj.append("ownerShipDocuments", formData.ownerShipDocuments);
    formDataObj.append("roadWorthinessDocuments", formData.roadWorthinessDocuments);


    try {
      const response = await fetch("https://api.spida.africa/logistics/vehicles.php", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();
      setLoading(false);
      if (result.status === "success") {
        alert("Vehicle registered successfully!");
        navigate("/logistics/fleet");
      } else {
        alert(result.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("Failed to register vehicle.");
    }
  };



  return (
    <div className="register_new_vehicle_page">
      <div className="profile_details">
        <div className="">
          <h1>Add new vehicle</h1>

          <div className="form_field">
            <div>
              <label>Type of Vehicle</label>
              <input name="vehicleType" type="text" onChange={handleChange} value={formData.vehicleType} />
            </div>
            <div>
                <label>Vehicle Registration Number</label>
                <input name="vehicleNumber" type="text" onChange={handleChange} value={formData.vehicleNumber} />
            </div>
          </div>

          <div className="form_field">
            <div>
              <label>Capacity of Vehicle</label>
              <input name="vehicleCapacity" type="text" onChange={handleChange} value={formData.vehicleCapacity} />
            </div>
            <div>
              <label>Vehicle Make and Model</label>
              <input name="vehicleModel" type="text" onChange={handleChange} value={formData.vehicleModel} />
            </div>
          </div>

          <div className="form_field">
            <div>
                <label>Special Features</label>
                <textarea name="vehicleFeatures" onChange={handleChange} value={formData.vehicleFeatures} />
            </div>
          </div>

          <div className="form_field custom_file_input">
            <input name="vehicleImg" type="file" onChange={handleChange} />
            <div>
              <h2><img src={uploadicon} alt="" /><span>{formData.vehicleImg?.name || "Upload vehicle image"}</span></h2>
            </div>
          </div>

          <div className="form_field custom_file_input">
            <input name="ownerShipDocuments" type="file" onChange={handleChange} />
            <div>
              <h2><img src={uploadicon} alt="" /><span>{formData.ownerShipDocuments?.name || "Upload ownership proof"}</span></h2>
            </div>
          </div>

          <div className="form_field custom_file_input">
            <input name="roadWorthinessDocuments" type="file" onChange={handleChange} />
            <div>
              <h2><img src={uploadicon} alt="" /><span>{formData.roadWorthinessDocuments?.name || "Upload roadworthiness document"}</span></h2>
            </div>
          </div>
        </div>
        <div className="">
          <button onClick={handleRegisterVehicle}>{loading ? "Registering..." : "Register Vehicle"}</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterNewVehicle;

