import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import fruits from "../../../assets/images/product/fruits.png";
import tick1 from "../../../assets/images/icons/plancheck1.png";
import flower1 from "../../../assets/images/product/flower1.png";
import flower2 from "../../../assets/images/product/flower2.png";
import tick2 from "../../../assets/images/icons/plancheck2.png";

import "./plans.css";

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState("Premium Plan");
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic Plan",
      cost: "#5,000/Month",
      features: ["All features in Basic", "Access to 10 orders"],
    },
    {
      name: "Premium Plan",
      cost: "#15,000/Month",
      features: ["All features in Basic", "Unlimited order access"],
    },
    {
      name: "Standard Plan",
      cost: "#10,000/Month",
      features: ["All features in Basic", "Access to 20 orders"],
    },
  ];

  // Table Data
  const tableRows = [
    {
      feature: "Order Access",
      basic: "10 per Month",
      standard: "20 per Month",
      premium: "Unlimited",
    },
    {
      feature: "Vehicle Registration",
      basic: "2 Vehicles",
      standard: "5 Vehicles",
      premium: "Unlimited",
    },
    {
      feature: "Delivery Tracking",
      basic: "Available",
      standard: "Available",
      premium: "Available",
    },
    {
      feature: "Support",
      basic: "Available",
      standard: "Available",
      premium: "Available",
    },
    {
      feature: "Cost",
      basic: "#5,000 / Month",
      standard: "#10,000 / Month",
      premium: "#15,000 / Month",
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleProceed = () => {
    navigate("/verify/:otp", { state: { plan: selectedPlan } });
  };

  const getTickImage = (plan) => (selectedPlan === plan ? tick2 : tick1);

  return (
    <div className="plans_page">
      <div>
        <h1>Subscription Plans for you</h1>
        <p>
          Choose a plan that suits your delivery needs and grow your earnings
          efficiently.
        </p>
        <div className="subscription_plans">
          <div className="">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`plan ${
                  selectedPlan === plan.name ? "selected" : ""
                }`}
                onClick={() => handleSelectPlan(plan.name)}
              >
                <div className="plan_head">
                  <h2>{plan.name}</h2>
                  <p>{plan.cost}</p>
                </div>
                <div className="features">
                  {plan.features.map((feature, index) => (
                    <div className="feature" key={index}>
                      <img src={getTickImage(plan.name)} alt="" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
                <button onClick={handleProceed}>Select Plan</button>
              </div>
            ))}
          </div>
        </div>

        <div className="features_list">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Basic Plan</th>
                <th>Standard Plan</th>
                <th>Premium Plan</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.feature}</td>
                  <td>{row.basic}</td>
                  <td>{row.standard}</td>
                  <td>{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <img src={fruits} alt="" className="fruits" />
      <img src={flower1} alt="" className="flower1" />
      <img src={flower2} alt="" className="flower2" />
    </div>
  );
};

export default Plans;
