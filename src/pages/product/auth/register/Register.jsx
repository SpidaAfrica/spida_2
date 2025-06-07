import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FarmerForm from "../../../../components/forms/FarmerForm";
import LogisticsForm from "../../../../components/forms/LogisticsForm";
import BuyerIndividualForm from "../../../../components/forms/BuyerIndividualForm";
import BuyerBusinessForm from "../../../../components/forms/BuyerBusinessForm";
import flower1 from "../../../../assets/images/product/flower1.png";
import bannerfruit from "../../../../assets/images/banner_fruit.png";
import flower2 from "../../../../assets/images/product/flower2.png";
import fruits from "../../../../assets/images/product/fruits.png";

import "./register.css";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Get initial values from query parameters or fallback to defaults
  const initialTab = queryParams.get("tab") || "farmer";
  const initialBuyerType = queryParams.get("buyerType") || "individual";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [buyerType, setBuyerType] = useState(initialBuyerType);

  const updateQueryParams = (tab, type) => {
    const params = new URLSearchParams();
    params.set("tab", tab);
    if (tab === "buyer") {
      params.set("buyerType", type);
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleChangeActiveTab = (tab) => {
    setActiveTab(tab);
    updateQueryParams(tab, buyerType);
  };

  const handleChangeBuyerType = (type) => {
    setBuyerType(type);
    updateQueryParams(activeTab, type);
  };

  // Sync state with query parameters on mount
  useEffect(() => {
    if (activeTab !== initialTab || buyerType !== initialBuyerType) {
      updateQueryParams(activeTab, buyerType);
    }
  }, [activeTab, buyerType, initialTab, initialBuyerType]);

  return (
    <div className="register_page">
      <img src={flower1} alt="" className="flower1" />
      <img src={flower2} alt="" className="flower2" />
      <div className="join_spider_as">
        <div className="join_container_1">
          <div className="join_item">
            <h1>
              Join SPIDA <span>as</span>
            </h1>
            <div className="item_tabs">
              <div
                className={
                  activeTab === "farmer" ? "item_tab active" : "item_tab"
                }
                onClick={() => handleChangeActiveTab("farmer")}
              >
                <h2>Farmer</h2>
                <div className="line"></div>
              </div>
              <div
                className={
                  activeTab === "logistics" ? "item_tab active" : "item_tab"
                }
                onClick={() => handleChangeActiveTab("logistics")}
              >
                <h2>Logistics</h2>
                <div className="line"></div>
              </div>
              <div
                className={
                  activeTab === "buyer" ? "item_tab active" : "item_tab"
                }
                onClick={() => handleChangeActiveTab("buyer")}
              >
                <h2>Buyer</h2>
                <div className="line"></div>
              </div>
            </div>
          </div>
          <div className="join_item">
            <img src={bannerfruit} alt="" className="bannerfruit"/>
          </div>
        </div>
        {activeTab === "buyer" && (
          <div>
            <div className="buyers_tabs">
              <div
                className={
                  buyerType === "individual"
                    ? "buyers_tab active"
                    : "buyers_tab"
                }
                onClick={() => handleChangeBuyerType("individual")}
              >
                <h3>Individual</h3>
              </div>
              <div
                className={
                  buyerType === "business" ? "buyers_tab active" : "buyers_tab"
                }
                onClick={() => handleChangeBuyerType("business")}
              >
                <h3>Business</h3>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="signup_forms">
        {activeTab === "farmer" && <FarmerForm />}
        {activeTab === "logistics" && <LogisticsForm />}
        {activeTab === "buyer" && buyerType === "individual" && (
          <BuyerIndividualForm />
        )}
        {activeTab === "buyer" && buyerType === "business" && (
          <BuyerBusinessForm />
        )}
      </div>
      <div className="flower">
        <img src={fruits} alt="" className="fruits" />
      </div>
    </div>
  );
};

export default Register;
