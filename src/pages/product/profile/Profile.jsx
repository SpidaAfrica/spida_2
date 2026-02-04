import React, { useState } from "react";
import { useParams } from "react-router-dom";
import profileImg from "../../../assets/images/userimg2.png";
import editicon from "../../../assets/images/icons/editprofile.png";
import uploadicon from "../../../assets/images/product/uploadicon.png";

import "./profile.css";
import { useNavigate } from "react-router-dom";
import FarmerProfile from "./FarmerProfile";
import LogisticsProfile from "./LogisticsProfile";

const initialFormState = {
  fullName: "Adisa Jairo Yusuf",
  dateOfBirth: "2024-12-11", // Updated to date format
  email: "adisajairo@gmail.com",
  phoneNumber: "08065109764",
  idType: "Drivers Licence",
  idNumber: "1122334455667",
  location: "Lagos",
  address: "38 Adeleye Street, Ikeja",
  accountName: "Adisa Jairo Yusuf",
  bank: "Access Bank",
  accountNumber: "2017192345",
  bvn: "11223344343445",
  farmName: "Adisa Farms",
  farmLocation: "Ogun State",
  farmLGA: "Ogun Central",
  farmAddress: "Adisa Farms acre 50 Ogundele street",
  farmLandmarks: "Brainy Technical School",
  farmSize: "20 Acres",
  productionScale: "Large Scale",
  staffSize: "50 Staffs",
  typeOfFarming: "Vegetable Farming",
  cropType: "Bell Pepper, Spring Onions",
  farmImages: "",
  titleDocuments: "",
  profileImage: profileImg,
};

const Profile = () => {
  const [formData, setFormData] = useState(initialFormState);
  const navigate = useNavigate();
  const { type } = useParams();

  const accountType = "logistics"

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? URL.createObjectURL(files[0]) || "" : value,
    }));
  };

  const handleEditProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profileImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSetUpFarm = () => {
    alert("Setting Up farm");
    navigate("/profile/setup-completed")
  }

  return (
    <div className="profile_page">
      {type === "farmer" && (<FarmerProfile />)}
      {type === "logistics" && (<LogisticsProfile />)}
    </div>
  );
};

export default Profile;
