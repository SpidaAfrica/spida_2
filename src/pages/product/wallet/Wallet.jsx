import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

import wallet from "../../../assets/images/icons/wallet.png";
import frontarrow from "../../../assets/images/icons/frontarrow2.png";
import newacct from "../../../assets/images/icons/newacct.png";
import check from "../../../assets/images/icons/check.png";

import "./wallet.css";

const Wallet = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const addedAccount = true;
  const modalRef = useRef(null);

  const transactions = [
    {
      id: "001",
      item: "Apple",
      amount: "#8,500",
      pickupStatus: "In Progress",
      deliveryStatus: "Pending",
      payment: "Paid",
    },
    {
      id: "002",
      item: "Orange",
      amount: "#5,200",
      pickupStatus: "Completed",
      deliveryStatus: "Delivered",
      payment: "Pending",
    },
    {
      id: "003",
      item: "Banana",
      amount: "#4,300",
      pickupStatus: "Completed",
      deliveryStatus: "Delivered",
      payment: "Paid",
    },
    {
      id: "004",
      item: "Mango",
      amount: "#7,100",
      pickupStatus: "In Progress",
      deliveryStatus: "Pending",
      payment: "Pending",
    },
    {
      id: "005",
      item: "Pineapple",
      amount: "#9,000",
      pickupStatus: "Completed",
      deliveryStatus: "Delivered",
      payment: "Paid",
    },
    {
      id: "006",
      item: "Strawberry",
      amount: "#3,800",
      pickupStatus: "In Progress",
      deliveryStatus: "Pending",
      payment: "Pending",
    },
    {
      id: "007",
      item: "Grapes",
      amount: "#6,400",
      pickupStatus: "Completed",
      deliveryStatus: "Delivered",
      payment: "Paid",
    },
    {
      id: "008",
      item: "Watermelon",
      amount: "#12,500",
      pickupStatus: "Completed",
      deliveryStatus: "Delivered",
      payment: "Pending",
    },
  ];

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false); // Close modal if clicked outside
    }
  };

  const handleWithdrawMoney = () => {
    setShowModal(!showModal);
    alert("sending money");
    navigate("/wallet");
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);

  return (
    <div className="wallet_page">
      {showModal && (
        <div className="withdraw_modal">
          <div className="amount_container" ref={modalRef}>
            <h3>
              {addedAccount ? "Enter Amount (#)" : "Select a Withdrawal Method"}
            </h3>
            {addedAccount && (
              <input
                type="text"
                name="amount"
                placeholder="Enter the amount of money to withdraw"
              />
            )}
            {!addedAccount && (
              <div className="add_new_tansac_account">
                <div className="tansac_account">
                  <div className="">
                    <img src={newacct} alt="" />
                    <span>Withdraw to Registered Account</span>
                  </div>
                  <img src={check} alt="" />
                </div>
                <div className="tansac_account add">
                  <div className="">
                    <img src={newacct} alt="" />
                    <span>Add new account details</span>
                  </div>
                  {/* <img src={check} alt="" /> */}
                </div>
              </div>
            )}
            <button onClick={handleWithdrawMoney}>
              Withdraw Money <img src={frontarrow} alt="" />
            </button>
          </div>
        </div>
      )}
      <div className="wallet_balance_analysis">
        <div className="wallet_balance">
          <div className="balance_header">
            <div className="">
              <img src={wallet} alt="" />
              <p>Wallet Balance</p>
            </div>
          </div>
          <div className="wallet_content">
            <h2>#75,000.00</h2>
          </div>
          <div className="wallet_button">
            <button onClick={handleShowModal}>Withdraw</button>
          </div>
        </div>
        <div className="analysis_graph">
          <App />
        </div>
      </div>

      <div className="transaction_history">
        <h1>Transaction History</h1>
        <p>Track all your transactions in one place.</p>

        <div className="order_items">
          {/* Header Section */}
          <div className="items_head">
            <ul>
              <li>Order ID</li>
              <li>Item</li>
              <li>Amount</li>
              <li>Pickup Status</li>
              <li>Delivery Status</li>
              <li>Payment</li>
            </ul>
          </div>

          {/* Body Section */}
          <div className="items_body">
            {transactions.map((transaction, index) => (
              <div className="item" key={index}>
                <ul>
                  <li>{transaction.id}</li>
                  <li>{transaction.item}</li>
                  <li>{transaction.amount}</li>
                  <li>{transaction.pickupStatus}</li>
                  <li>{transaction.deliveryStatus}</li>
                  {/* <li>{transaction.destination}</li> */}
                  <li
                    className={`status ${transaction.payment
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {transaction.payment}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionAnalytics = ({ data }) => {
  return (
    <div style={{ color: "white" }}>
      <h3
        className="t_analysis_header"
        style={{ textAlign: "left", marginBottom: "10px" }}
      >
        Transactions Analytics
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid
            stroke="#ffffff"
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis dataKey="day" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip />
          <Legend
            verticalAlign="top"
            wrapperStyle={{
              color: "white",
              position: "relative",
              bottom: "225px",
              right: "100px",
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#00ff00"
            strokeWidth={1}
          />
          <Line
            type="monotone"
            dataKey="withdrawal"
            stroke="#ffcc00"
            strokeWidth={1}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const sampleData = [
  { day: "Monday", income: 20000, withdrawal: 15000 },
  { day: "Tuesday", income: 40000, withdrawal: 20000 },
  { day: "Wednesday", income: 60000, withdrawal: 30000 },
  { day: "Thursday", income: 75000, withdrawal: 50000 },
  { day: "Friday", income: 50000, withdrawal: 40000 },
  { day: "Saturday", income: 30000, withdrawal: 60000 },
  { day: "Sunday", income: 40000, withdrawal: 25000 },
];

const App = () => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <TransactionAnalytics data={sampleData} />
    </div>
  );
};

export default Wallet;
