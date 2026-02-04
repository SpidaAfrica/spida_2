import React from "react";
import { useNavigate} from "react-router-dom";

import forward from "../../../assets/images/icons/frontarrow.png";
import fruits from "../../../assets/images/product/fruits.png";
import checkedcircle from "../../../assets/images/icons/checkedcircle.png";

const ProfileSetUpCompleted = () => {
  const navigate = useNavigate();
  const user_type = sessionStorage.getItem('userType')

  const handleGoToDashboard = () => {
    alert("Going to dashboard");
    navigate(`/dashboard/${user_type}`);
  };

  return (
    <div className="verify_otp_page created profile_setup_completed">
      <div className="">
        <img className="checked" src={checkedcircle} alt="" />
        <h1>Profile Setup Completed!</h1>
        <p>Congratulations! Your farm is set up.</p>
        <div className="verify_actions">
          <div className="">
            <button onClick={handleGoToDashboard} className="verify">
              <span>Explore SPIDA</span>
              <img src={forward} alt="" />
            </button>
          </div>
        </div>
      </div>
      <div className="flower">
        <img src={fruits} alt="" className="fruits" />
      </div>
    </div>
  );
};

export default ProfileSetUpCompleted;
