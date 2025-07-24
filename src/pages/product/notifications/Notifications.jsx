/*

import React from "react";

import notedot from "../../../assets/images/icons/notedot.png";

import "./notifications.css";

const Notifications = () => {
  return (
    <div className="notifications_page">
      <div className="note_header">
        <h1>Notifications</h1>
        <h6>Mark all as read</h6>
      </div>

      <div className="notifications_content">
        <div className="note_content_header">
          <h4>
            <span>Alert</span> <span className="label">15</span>
          </h4>
        </div>

        <div className="notification_items">
          <div className="notification_item">
            <div>
              <h3>Order Placement</h3>
              <h1>
                New Order: 50kg Tomatoes, ₦25,000. Delivery: Nov 25. Prepare for
                pickup!
              </h1>
              <p>2 mins ago</p>
            </div>
            <img src={notedot} alt="" />
          </div>
          <div className="notification_item">
            <div>
              <h3>Order Placement</h3>
              <h1>
                New Order: 50kg Tomatoes, ₦25,000. Delivery: Nov 25. Prepare for
                pickup!
              </h1>
              <p>2 mins ago</p>
            </div>
            <img src={notedot} alt="" />
          </div>
          <div className="notification_item">
            <div>
              <h3>Order Placement</h3>
              <h1>
                New Order: 50kg Tomatoes, ₦25,000. Delivery: Nov 25. Prepare for
                pickup!
              </h1>
              <p>2 mins ago</p>
            </div>
            <img src={notedot} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;


*/




import React, { useEffect, useState } from "react";
import notedot from "../../../assets/images/icons/notedot.png";
import "./notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  let userType = sessionStorage.getItem("userType");
  let userId = sessionStorage.getItem(`${userType}Id`);

  useEffect(() => {
    if(userType === "individual"){
      fetch(`https://api.spida.africa/individual/get_order_individual_dashboard.php?individual_id=${userId}`)
      .then((response) => response.json())
      .then((data) => setNotifications(data.orders))
      .catch((error) => console.error("Error fetching notifications:", error));
    }
    if(userType === "farmer"){
      fetch("https://api.spida.africa/individual/get_orders.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmer_id: userId }),
      })
      .then((response) => response.json())
      .then((data) => setNotifications(data.orders))
      .catch((error) => console.error("Error fetching notifications:", error));
    }

    if(userType === "logistics"){
      fetch(`https://api.spida.africa/logistics/get_orders_for_logistics.php?logistics_id=${userId}`)
      .then((response) => response.json())
      .then((data) => setNotifications(data.orders))
      .catch((error) => console.error("Error fetching notifications:", error));
    }

    if(userType === "business"){
      fetch(`https://api.spida.africa/individual/get_order_individual_dashboard.php?individual_id=${userId}`)
      .then((response) => response.json())
      .then((data) => setNotifications(data.orders))
      .catch((error) => console.error("Error fetching notifications:", error));
    }
  }, [userId]);
/*
  const markAllAsRead = () => {
    fetch(`https://api.spida.africa/${userType}/mark_notifications_read.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    }).then(() => {
      setNotifications((prev) => prev.map((note) => ({ ...note, is_read: true })));
    });
  };
*/


  // Function to generate messages dynamically
  const getNotificationMessage = (status, orderId) => {
    switch (status) {
      case "Accepted":
        return userType === "individual" || userType === "business"
          ? `Your order #${orderId} has been accepted by the farmer.`
          : userType === "farmer"
          ? `You have accepted order #${orderId}.`
          : "A new order has been accepted and is awaiting pickup.";

      case "Picked":
        return userType === "individual" || userType === "business"
          ? `Your order #${orderId} has been picked from the farm.`
          : userType === "farmer"
          ? `Order #${orderId} has been picked from your farm.`
          : `Order #${orderId} is now in transit.`;

      case "Confirmed":
        return userType === "individual" || userType === "business"
          ? `Your order #${orderId} has been confirmed.`
          : userType === "farmer"
          ? `Order #${orderId} has been confirmed by you.`
          : `Order #${orderId} has been confirmed and allowed for delivery.`;

      case "Delivered":
        return userType === "individual" || userType === "business"
          ? `Your order #${orderId} has been delivered successfully.`
          : userType === "farmer"
          ? `Your produce for order #${orderId} has been delivered.`
          : `Delivery for order #${orderId} is complete.`;

      case "Declined":
        return userType === "individual" || userType === "business"
          ? `Your order #${orderId} was declined.`
          : userType === "farmer"
          ? `You have declined order #${orderId}.`
          : `Order #${orderId} has been declined.`;

      default:
        return "You have a new notification.";
    }
  };

  return (
    <div className="notifications_page">
      <div className="note_header">
        <h1>Notifications</h1>
       {/* <h6 onClick={markAllAsRead}>Mark all as read</h6>*/}
      </div>

      <div className="notifications_content">
        <div className="note_content_header">
          <h4>
            <span>Alert</span> <span className="label">{notifications.length}</span>
          </h4>
        </div>

        <div className="notification_items">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.order_id}
                className={`notification_item ${notification.is_read ? "read" : ""}`}
              >
                <div>
                  <h3>{notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}</h3>
                  <h1>{getNotificationMessage(notification.status, notification.order_id)}</h1>
                  <p>{new Date(notification.created_at).toLocaleString()}</p>
                </div>
                <img src={notedot} alt="notification icon" />
              </div>
            ))
          ) : (
            <p>No notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

