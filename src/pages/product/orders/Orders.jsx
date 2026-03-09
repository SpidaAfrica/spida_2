import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Pickup from "./Pickup";
import "./orders.css";
import AllOrders from "./AllOrders";
import OngoingDelivery from "./OngoingDelivery";
import LogisticsOrders from "../../../components/orders/LogisticsOrders";
import LogisticsPickup from "./LogisticsPickup";
import LogisticsDelivery from "./LogisticsDelivery";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the userType from the URL path (e.g., "/orders/logistics" or "/orders/farmers")
  const pathSegments = location.pathname.split("/");
  const userTypeFromURL = pathSegments[2] || "farmers"; // Default to "farmers" if missing

  const queryParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState(queryParams.get("tab") || "orders");

  const updateQueryParams = (tab) => {
    const params = new URLSearchParams();
    params.set("tab", tab);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleChangeActiveTab = (tab) => {
    setActiveTab(tab);
    updateQueryParams(tab);
  };

  return (
    <div className="orders_page">
      {userTypeFromURL === "logistics" ? (
        <div>
          <div className="join_spider_as ordersTabs">
            <div className="join_container_1">
              <div className="join_item">
                <div className="item_tabs">
                  {["orders", "pickup", "deliveries"].map((tab) => (
                    <div
                      key={tab}
                      className={`item_tab ${activeTab === tab ? "active" : ""}`}
                      onClick={() => handleChangeActiveTab(tab)}
                    >
                      <h2>{tab.charAt(0).toUpperCase() + tab.slice(1)}</h2>
                      <div className="line"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {activeTab === "orders" && <LogisticsOrders />}
          {activeTab === "pickup" && <LogisticsPickup />}
          {activeTab === "deliveries" && <LogisticsDelivery />}
        </div>
      ) : (
        <div>
          <div className="join_spider_as ordersTabs">
            <div className="join_container_1">
              <div className="join_item">
                <div className="item_tabs">
                  {["orders", "pickup", "deliveries"].map((tab) => (
                    <div
                      key={tab}
                      className={`item_tab ${activeTab === tab ? "active" : ""}`}
                      onClick={() => handleChangeActiveTab(tab)}
                    >
                      <h2>{tab.charAt(0).toUpperCase() + tab.slice(1)}</h2>
                      <div className="line"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {activeTab === "orders" && <AllOrders />}
          {activeTab === "pickup" && <Pickup />}
          {activeTab === "deliveries" && <OngoingDelivery />}
        </div>
      )}
    </div>
  );
};

export default Orders;
