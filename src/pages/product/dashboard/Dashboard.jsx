import React from "react";
import { useParams } from "react-router-dom";

import FarmerDashboard from "./FarmerDashboard";
import LogisticsDashboard from "./LogisticsDashboard";
import InvdividualBuyer from "./InvdividualBuyer";
import BusinessBuyer from "./BusinessBuyer";

import "./dashboard.css";

const Dashboard = () => {
  const { type } = useParams(); // Get account type from URL

  return (
    <>
      {type === "farmer" && <FarmerDashboard />}
      {type === "logistics" && <LogisticsDashboard />}
      {type === "individual" && <InvdividualBuyer />} 
      {type === "business" && <BusinessBuyer />}
    </>
  );
};

export default Dashboard;

